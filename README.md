#match

A pattern matching library for JavaScript inspired by Clojure's `core.match`.

##Example
```js
import match from 'match';

const pattern = [true, true, true, () => 'Yes!'];

match(patterns)(true, true, true); // => 'Yes!'
match(pattern)(true, true, false); // Error: No match found(…)
```

##License
MIT
