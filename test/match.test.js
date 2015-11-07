import test from 'tape';
import match from '../lib/match';

test('param binding', t => {
  const pattern = [3, 'barks!!!', (num, phrase) => `${num} ${phrase}`];
  const m = match(pattern);

  t.equal(m(3, 'barks!!!'), '3 barks!!!');

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

    t.equal(m2(Infinity), 'fetch forever!');
    t.throws(() => m2(-Infinity));

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
