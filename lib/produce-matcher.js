import producePatternEvaluator from './produce-pattern-evaluator';

/**
 * Creates a `matcher` function that will either execute the supplied `cb`,
 * binding the `inputs` passed to `matcher`, or will throw an exception,
 * messaging that no match was found testing the `inputs` to the `patterns` in
 * the current scope. `matcher` will minimally evaluate `inputs`, so that if
 * any single input does not match its corresponding pattern, the entire
 * expression is a non-match, and no remaining `patterns` and `inputs` will be
 * tested.
 *
 * @param {Function} cb The function to invoke and bind params to on match.
 * @param {Array} patterns The patterns to test for matches against.
 * @return {Function} The matcher which will accept a spread of `inputs`.
 */
export default function produceMatcher(cb, patterns) {
  const evaluators = patterns.map(producePatternEvaluator);

  return function matcher(...inputs) {
    const match = inputs.every((input, i) => evaluators[i](input));

    if (match) return cb(...inputs);

    throw new Error('No match found.');
  }
}
