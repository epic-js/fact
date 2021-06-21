const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x)

const Maybe = (value) => ({
  exists: typeof value !== 'undefined' && value !== null,
  value,
  chain: (cb) => cb(Maybe(value)),
  map: (cb) => cb(value),
})
Maybe.Just = (value) => Maybe(value)
Maybe.Nothing = Maybe(null)

function deepFreeze(object) {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object)

  // Freeze properties before freezing self

  // eslint-disable-next-line no-restricted-syntax
  for (const name of propNames) {
    const value = object[name]

    if (value && typeof value === 'object') {
      deepFreeze(value)
    }
  }

  return Object.freeze(object)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = {
  pipe,
  Maybe,
  deepFreeze,
  sleep,
}
