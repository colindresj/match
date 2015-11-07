import patternsShallowEqualInputs from './patterns-shallow-equal-inputs';

/**
 * Determines if the `patterns` match the supplied `inputs`.
 *
 * @param {Array} patterns
 * @param {Array} inputs
 * @return {Boolean}
 * @private
 */
export default function isMatch(patterns, inputs) {
  return patternsShallowEqualInputs(patterns, inputs);
}
