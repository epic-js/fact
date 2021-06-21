const { assert } = require('chai')
const { pipe } = require('../auxiliary')
const { handleError } = require('./core')

const genError = (code) =>
  pipe((error) => {
    // eslint-disable-next-line no-param-reassign
    error.code = code
    return error
  })(new Error(code))

describe('appendToStream core', () => {
  it('should generate the next retry delay if code = 23505', () =>
    [...new Array(10)].map((_, index) =>
      pipe(
        () =>
          handleError({
            err: genError('23505'),
            attemptsMade: index,
            random: 0.36,
          }),
        (res) =>
          assert.deepEqual(res, {
            instruction: 'sleepThenRetry',
            data: {
              nextAttempt: index + 1,
              backoffDelay: 2 ** index * 0.36,
            },
          })
      )()
    ))
  it('should throw if attempts = 10', () =>
    pipe(
      () => handleError({ err: genError('23505'), attemptsMade: 10 }),
      (res) =>
        assert.deepEqual(res, {
          instruction: 'throw',
          data: { msg: 'Concurrency violation after 10 attempts' },
        })
    )())
  it('should throw if code not 23505', () =>
    pipe(
      () => handleError({ err: { name: 'RandomError' }, attemptsMade: 1 }),
      (res) =>
        assert.deepEqual(res, {
          instruction: 'throw',
          data: { msg: 'RandomError' },
        })
    )())
})
