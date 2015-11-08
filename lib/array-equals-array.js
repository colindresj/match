import deepEqual from 'deep-equal';

/**
 * Determines if `firstArr` is equal to `secondArr`. The two are strictly
 * compared, then shallowly compared and finally deeply compared using Node's
 * `deepEqual` algorithm with strict equality comparison on leaf nodes.
 *
 * @param {Array} firstArr
 * @param {Array} secondArr
 * @return {Boolean}
 */
export default function arrayEqualsArray(firstArr, secondArr) {
  if (firstArr === secondArr) return true;

  const len = firstArr.length;
  let i = len;

  if (len !== secondArr.length) return false;

  let shallowEql = true;

  while (i--) {
    if (firstArr[i] !== secondArr[i]) {
      shallowEql = false; break;
    }
  }

  if (shallowEql) return true;

  return deepEqual(firstArr, secondArr, { strict: true });
}