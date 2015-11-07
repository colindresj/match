import isMatch from './is-match';

/**
 * Creates a `matcher` function that will either execute the supplied `cb`,
 * binding the `inputs` passed to `matcher`, or will throw an exception,
 * messaging that no match was found testing the `inputs` to the `patterns` in
 * the current scope.
 *
 * @param {Function} cb The function to invoke and bind params to on match.
 * @param {Array} patterns The patterns to test for matches against.
 * @return {Function} The matcher which will accept a spread of `inputs`.
 * @private
 */
export default function produceMatcher(cb, patterns) {
  return function matcher(...inputs) {
    if (isMatch(patterns, inputs)) return cb(...inputs);

    throw new Error('No match found.');
  }
}
