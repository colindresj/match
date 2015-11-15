/**
 * Functional wrapper around `Object::toString`.
 *
 * @param {*} val
 * @return {String}
 * @private
 */
function asString(val) {
  return Object.prototype.toString.call(val);
}

/**
 * Determines if `val` is a regular expression.
 *
 * @param {*} val
 * @return {Boolean}
 * @public
 */
export function isRegExp(val) {
  return asString(val) === '[object RegExp]';
}

/**
 * Determines if `val` is an array.
 *
 * @param {*} val
 * @return {Boolean}
 * @public
 */
export function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determines if `val` is an object.
 *
 * @param {*} val
 * @return {Boolean}
 * @public
 */
export function isObject(val) {
  return asString(val) === '[object Object]';
}

/**
 * Determines if `val` is a function.
 *
 * @param {*} val
 * @return {Boolean}
 * @public
 */
export function isFunction(val) {
  return asString(val) === '[object Function]';
}
