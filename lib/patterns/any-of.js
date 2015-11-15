/**
 * Creates a new `orPattern` and sets the patterns on it.
 *
 * @param {*} patterns A spread of patterns to or.
 * @return {Object} orPattern
 * @public
 */
export default function anyOf(...patterns) {
  return Object.create(orPatternProto, {
    patterns: {
      value: patterns,
      configurable: false,
      enumerable: true,
      writable: false
    }
  });
}

/**
 * The prototype for a new `orPattern`.
 *
 * @private
 */
const orPatternProto = Object.create(null, {
  '__is or pattern__': {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  }
});
