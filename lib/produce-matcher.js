import isFalse from './is-false';
import producePatternEvaluator from './produce-pattern-evaluator';

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
  const evaluators = patterns.map(producePatternEvaluator);

  return function matcher(...inputs) {
    const evaluations = inputs.map((input, i) => evaluators[i](input));

    if (!evaluations.some(isFalse)) return cb(...inputs);

    throw new Error('No match found.');
  }
}
