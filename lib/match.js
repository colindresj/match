import produceMatcher from './produce-matcher';

/**
 * The exposed public function, which implements pattern matching of primitive
 * values and regular expressions.
 *
 * @param {Array} expression The expression to test matches on.
 * @return {Function} The `matcher` that will be passed patterns.
 * @public
 *
 * @example
 * const matcher = match([true, true, () => 'Dog!'])
 * matcher(true, true) // => Dog!
 * matcher(true, false) // => Error: No match found(…)
 */
export default function match(expression) {
  const [cb, ...patterns] = expression.reverse();

  return produceMatcher(cb, patterns.reverse());
}
