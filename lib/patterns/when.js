import curry from 'curry';
import { isArray } from '../is';

/**
 * Creates a new `guardedPattern` and sets the `pattern` and `guards` on it.
 *
 * @param {Function|Array} guards
 * @param {*} pattern
 * @return {Object} guardedPattern
 * @public
 */
export default curry(
  function when(guards, pattern) {
    return Object.create(guardedPatternProto, {
      guards: {
        value: isArray(guards) ? guards : [guards],
        configurable: false,
        enumerable: true,
        writable: false
      },

      pattern: {
        value: pattern,
        configurable: false,
        enumerable: true,
        writable: false
      }
    });
  }
);

/**
 * The prototype for a new `guardedPattern`.
 *
 * @private
 */
const guardedPatternProto = Object.create(null, {
  '__is guarded pattern__': {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  }
});
