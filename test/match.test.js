import test from 'tape';
import match from '../lib/match';

test('literals', t => {
  const pattern = [true, true, false];

  match(
    pattern,
    [[true, true, false], 'a'],
    [[false, true, true], 'b'],
    [[true, false, true], 'c']
  ).otherwise('d');

  t.end();
});
