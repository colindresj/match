import curry from 'curry';
import arrayMatchesArray from './array-matches-array';
import { isArray, isFunction, isObject, isRegExp } from './is';
import objectMatchesObject from './object-matches-object';
import wildcard from './patterns/wildcard';

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
 * @public
 */
export default function producePatternEvaluator(pattern) {
  if (pattern === wildcard) return () => true;

  const partialEvaluation = curry(invokeEvaluator)(pattern);

  if (isRegExp(pattern)) return partialEvaluation(evaluateRegExp);

  if (isArray(pattern)) return partialEvaluation(evaluateArray);

  if (isObject(pattern)) return partialEvaluation(evaluateObject);

  if (isFunction(pattern)) return partialEvaluation(evaluateFunc);

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
 * Evaluates an array for a match. Matches are determined using the
 * `arrayMatchesArray` module.
 *
 * @param {*} input
 * @param {Array} arr
 * @return {Boolean}
 * @private
 */
function evaluateArray(input, arr) {
  return arrayMatchesArray(input, arr);
}

/**
 * Evaluates an object for a match. Matches are determined using the
 * `objectMatchesObject` module.
 *
 * @param {*} input
 * @param {Object} obj
 * @return {Boolean}
 * @private
 */
function evaluateObject(input, obj) {
  if (obj['__is or pattern__']) return evaluateOrPattern(input, obj);

  if (obj['__is guarded pattern__']) return evaluateGuardedPattern(input, obj);

  return objectMatchesObject(input, obj);
}

/**
 * Evaluates a function for match. Functions are strictly matched to test
 * whether the pattern and input are the same exact function. Otherwise, the
 * match is evaluated assuming `func` was used as a constructor and `input` as
 * the result of new-ing an instance of `func`. In this way, the function
 * pattern can be used to evaluate instances of a constructor function.
 *
 * @param {*} input
 * @param {Function} func
 * @return {Boolean}
 * @private
 */
function evaluateFunc(input, func) {
  if (input === func) return true;

  return input.constructor === func;
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

/**
 * Evaluates each of the patterns contained within `orPattern` for a match.
 * If the function comes accross any evaulation that is a match, it will result
 * in a full match. Evaluation of the `orPattern` is optimized to minimally
 * evaluate patterns. That means that if `orPattern` holds the following
 * patterns, `1, 2, 3`, and `input` is `1`, only a single evaluation will be
 * processed.
 *
 * @param {*} input
 * @param {Object} orPattern
 * @return {Boolean}
 * @private
 */
function evaluateOrPattern(input, { patterns }) {
  return patterns.some(pattern => producePatternEvaluator(pattern)(input));
}

/**
 * Evaluates the pattern contained within `guardedPattern` for a match if all
 * of its guards are true. Guards are minimally evaluated. That means that if
 * `guardedPattern` has two guards, and the last one returns `false`, the first
 * one will not be tested, and `pattern` itself won't be evaluated. `pattern`
 * will only ever be evaluated if all the guards return `true`.
 *
 * @param {*} input
 * @param {Object} guardedPattern
 * @return {Boolean}
 * @private
 */
function evaluateGuardedPattern(input, { guards, pattern }) {
  if (!guards.every(guard => guard(input))) return false;

  return producePatternEvaluator(pattern)(input);
}
