import test from 'tape';
import match from '../lib/match';
import _ from '../lib/wildcard';

test('param binding', t => {
  const pattern = [3, 'barks!!!', (num, phrase) => `${num} ${phrase}`];
  const m = match(pattern);

  t.equal(m(3, 'barks!!!'), '3 barks!!!');

  t.end();
});

test('wildcard', t => {
  const pattern = [_, () => 'Frizbee!'];
  const m = match(pattern);

  t.equal(m(true), 'Frizbee!');
  t.equal(m('dog'), 'Frizbee!');
  t.equal(m(1), 'Frizbee!');
  t.equal(m(undefined), 'Frizbee!');
  t.equal(m(null), 'Frizbee!');
  t.equal(m(/dog/), 'Frizbee!');
  t.equal(m([1, 2]), 'Frizbee!');

  t.end();
});

test('primitives', ({ test }) => {
  test('booleans', t => {
    const pattern = [true, false, () => 'Dog!'];
    const m = match(pattern);

    t.equal(m(true, false), 'Dog!');
    t.throws(() => m(false, false));

    t.end();
  });

  test('strings', t => {
    const pattern = ['go', 'chew', 'the', () => 'BONE!'];
    const m = match(pattern);

    t.equal(m('go', 'chew', 'the'), 'BONE!');
    t.throws(() => m(`don't`, 'chew', 'the'));

    t.end();
  });

  test('numbers', t => {
    const pattern = [1, 2, 3, () => 'fetch!'];
    const m = match(pattern);

    t.equal(m(1, 2, 3), 'fetch!');
    t.throws(() => m(4, 5, 6));

    const pattern2 = [Infinity, () => 'fetch forever!'];
    const m2 = match(pattern2);

    t.comment('- Infinity');
    t.equal(m2(Infinity), 'fetch forever!');
    t.throws(() => m2(-Infinity));

    t.comment('- NaN');
    const pattern3 = [NaN, () => 'fetch for ...?'];
    const m3 = match(pattern3);

    t.equal(m3(NaN), 'fetch for ...?');
    t.throws(() => m3(1000));

    t.end();
  });

  test('undefined', t => {
    const pattern = [undefined, () => 'this is undefined...'];
    const m = match(pattern);
    const defed = 'I AM defined';
    let undef;

    t.equal(m(undefined), 'this is undefined...');
    t.equal(m(void 0), 'this is undefined...');
    t.equal(m(undef), 'this is undefined...');
    t.throws(() => m('I AM defined'));
    t.throws(() => m(defed));

    t.end();
  });

  test('null', t => {
    const pattern = [null, null, () => 'nothing-ness...'];
    const m = match(pattern);

    t.equal(m(null, null), 'nothing-ness...');
    t.throws(() => m(undefined, null));
    t.throws(() => m('I exist', null));

    t.end();
  });
});

test('RegExp', t => {
  const pattern = [/!$/, match => `${match}!!`];
  const m = match(pattern);

  t.equal(m('Bone!'), 'Bone!!!');
  t.throws(() => m('bath time :('));

  const pattern2 = [new RegExp('!$'), match => `${match}!!`];
  const m2 = match(pattern2);

  t.equal(m2('Ball!'), 'Ball!!!');

  t.end();
});

test('Array', t => {
  const pattern = [
    ['bone', 'bone', 'bone'],
    match => `I got ${match.length} bones`
  ];
  const m = match(pattern);

  t.equal(m(['bone', 'bone', 'bone']), 'I got 3 bones');
  t.throws(() => m(['bone', 'rock', 'bone']));

  t.comment('- Array constructor');
  const pattern2 = [
    new Array('bone', 'bone', 'bone'),
    match => `I got ${match.length} bones`
  ];
  const m2 = match(pattern2);

  t.equal(m2(['bone', 'bone', 'bone']), 'I got 3 bones');
  t.throws(() => m2(['bone', 'rock', 'bone']));

  const pattern3 = [
    new Array(1),
    match => `I got ${match.length} ?`
  ];
  const m3 = match(pattern3);

  t.equal(m3([undefined]), 'I got 1 ?');
  t.throws(() => m3([]));

  t.comment('- Deep Arrays');
  const pattern4 = [
    [{ name: 'Fido', age: 0 }],
    match => 'We got a puppy!'
  ];
  const m4 = match(pattern4);

  t.equal(m4([{ name: 'Fido', age: 0 }]), 'We got a puppy!');
  t.throws(() => m4([{ name: 'Fido', age: 5 }]));

  const pattern5 = [[1, 2, [1, 2]], match => 'We got a puppy!'];
  const m5 = match(pattern5);

  t.equal(m5([1, 2, [1, 2]]), 'We got a puppy!');
  t.throws(() => m5([1, 2, [1]]));

  t.comment('- Wildcard items');
  const pattern6 = [[1, _, 3], () => 'Treats!'];
  const m6 = match(pattern6);

  t.equal(m6([1, 1000, 3]), 'Treats!');
  t.throws(() => m6([10000, 2, 3]));

  t.end();
});

test('Objects', t => {
  const pattern = [
    { activity: 'fetch' },
    match => `Lets play ${match.activity}!`
  ];
  const m = match(pattern);

  t.equal(m({ activity: 'fetch' }), 'Lets play fetch!');
  t.throws(() => m({ activity: 'frizbee' }));

  t.comment('- Deep Objects');
  const pattern2 = [
    { activities: ['fetch', 'frizbee'] },
    match => `Lets play ${match.activities.join(' and ')}!`
  ];
  const m2 = match(pattern2);

  t.equal(m2({ activities: ['fetch', 'frizbee'] }), 'Lets play fetch and frizbee!');
  t.throws(() => m2({ activities: ['frizbee'] }));

  t.comment('- Wildcard values');
  const pattern3 = [
    { activity: _  },
    () => 'Treats!'
  ];
  const m3 = match(pattern3);

  t.equal(m3({ activity: 'frizbee' }), 'Treats!');
  t.throws(() => m3({ activities: null }));

  t.comment('- Object.create');
  const pattern4 = [
    { activity: 'fetch'  },
    () => 'Treats!'
  ];
  const m4 = match(pattern4);
  const obj = Object.create(null);
  obj.activity = 'fetch';

  t.equal(m4(obj), 'Treats!');
  t.throws(() => m4({ activities: null }));

  const obj2 = Object.create(null);
  obj2.activity = 'fetch';

  const pattern5 = [obj2, () => 'Treats!'];
  const m5 = match(pattern5);

  t.equal(m5({ activity: 'fetch' }), 'Treats!');
  t.throws(() => m5({ activities: null }));

  t.comment('- Non-Object instances');
  function Treat(kind = 'jerky') { this.kind = kind; }

  const treat = new Treat();
  const pattern6 = [treat, () => 'Treats!'];
  const m6 = match(pattern6);

  t.equal(m6(new Treat()), 'Treats!');
  t.throws(() => m6(new Treat('kibble')));

  t.end();
});
