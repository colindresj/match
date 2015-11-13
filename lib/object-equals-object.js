import deepEqual from 'deep-equal';
import wildcard from './wildcard';

/**
 * Determines if `firstObj` is equal to `secondObj`. The two are strictly
 * compared, then, if they exist, their constructors are compared, then the
 * number of own properties, as determined by the length of `Object.keys` are
 * compared, then the two objects are shallowly compared and finally deeply
 * compared using Node's `deepEqual` algorithm with strict equality comparison
 * on leaf nodes.
 *
 * @param {Object} firstObj
 * @param {Object} secondObj
 * @return {Boolean}
 */
export default function objectEqualsObject(firstObj, secondObj) {
  if (firstObj === secondObj) return true;

  if (
    firstObj.constructor !== secondObj.constructor &&
    firstObj.constructor !== undefined &&
    secondObj.constructor !== undefined
  ) {
    return false;
  }

  const firstKeys = Object.keys(firstObj);

  if (firstKeys.length !== Object.keys(secondObj).length) return false;

  let i, shallowEqual = true;

  for (i = 0; i < firstKeys.length; i++) {
    const key = firstKeys[i];

    if (firstObj[key] !== secondObj[key] && secondObj[key] !== wildcard) {
      shallowEqual = false;
    }
  }

  return shallowEqual || deepEqual(firstObj, secondObj, { strict: true });
}
