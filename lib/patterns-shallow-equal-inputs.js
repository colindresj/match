/**
 * Shallowly checks if two arrays of `patterns` and `inputs` are shallowly
 * equal, first by determining if they have the same length, then by checking
 * each item in both arrays with strict equality or NaN-iness for numbers.
 *
 * @param {Array} patterns
 * @param {Array} inputs
 * @return {Boolean}
 * @private
 */
export default function patternsShallowEqualInputs(patterns, inputs) {
  const len = patterns.length;
  let i = len;

  if (len !== inputs.length) return false;

  while (i--) {
    if (patterns[i] !== inputs[i]) {
      if (typeof inputs[i] === 'number' && isNaN(patterns[i]) && isNaN(inputs[i])) {
        continue;
      }

      return false;
    }
  }

  return true;
}
