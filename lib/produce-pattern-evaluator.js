import curry from 'curry';

/**
 * Creates a pattern evaluator based on the type of pattern passed to it.
 * A pattern evaluator is a function that takes in a pattern and a value of a
 * specific type and evaluates the two against one another to determine if
 * there is a match. Evaluators return true on match, and false when no match.
 *
 * All evaluators are processed by `invokeEvaluator`, which is a mutli-param
 * function that returns an evaluation. The `invokeEvaluator` function is used
 * because it affords simple partial argument application through currying.
 *
 * @param {*} pattern The pattern that will be tested against by an evaluator.
 * @return {Function} The evaluator.
 * @private
 */
export default function producePatternEvaluator(pattern) {
  const asString = Object.prototype.toString.call(pattern);
  const partialEvaluation = curry(invokeEvaluator)(pattern);

  if (asString === '[object RegExp]') return partialEvaluation(evaluateRegExp);

  return partialEvaluation(evaluatePrimitive);
}

/**
 * Evaluates `evaluator`, passing `pattern` and `input` as arguments.
 *
 * @param {*} pattern
 * @param {Function} evaluator
 * @param {*} input
 * @return {Boolean} The result of calling `evaluator`.
 * @private
 */
function invokeEvaluator(pattern, evaluator, input) {
  return evaluator(input, pattern);
}

/**
 * Evaluates a regular expression for a match. Matches are determined based on
 * the result of `RegExp.prototype.test`, passing in `input` and calling in
 * the context of `regExp`.
 *
 * @param {*} input
 * @param {RegExp} regExp
 * @return {Boolean}
 * @private
 */
function evaluateRegExp(input, regExp) {
  return regExp.test(input);
}

/**
 * Evaluates a primitve for a match. Primitives are any of the five JavaScript
 * primitive types (String, Number, Boolean, Undefined or Null). Primtives are
 * evaluated using strict equality, the exception being `NaN`, which always
 * returns `false` when strictly compared. A `NaN` pattern matches when the
 * passed primitive is also `NaN` as deteremined by `isNaN`.
 *
 * @param {*} input
 * @param {String|Number|Boolean|Undefined|Null} primitive
 * @return {Boolean}
 * @private
 */
function evaluatePrimitive(input, primitive) {
  if (typeof primitive !== 'number' || !isNaN(primitive)) {
    return primitive === input;
  }

  return isNaN(input);
}
