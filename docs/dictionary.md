# Dictionary API

Fetch word definitions, part of speech, and example sentences easily.

## Features
- Get multiple meanings for a word
- Includes phonetic spelling
- Works in both Node.js and Browser
- Zero dependencies

## Example (Node.js)
```js
const { getWordMeaning } = require("./apis/dictionary/dictionary.js");
const result = await getWordMeaning("peace");
console.log(result);
