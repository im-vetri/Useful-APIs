# 📘 Dictionary API

Fetch word meanings, parts of speech, phonetics, and example sentences easily.  
This module uses the free **Dictionary API** ([dictionaryapi.dev](https://dictionaryapi.dev)) and works in **both Node.js and Browser** environments.

---

## 🚀 Features
- Get multiple definitions for any English word  
- Includes part of speech and phonetic transcription  
- Example sentences (if available)  
- Zero dependencies  
- Works seamlessly in **Node.js** and **Browser**

---

## 🧠 Quick Start

### 🟢 Node.js Example
```js
const { getWordMeaning } = require("./apis/dictionary/dictionary.js");

(async () => {
  const result = await getWordMeaning("inspire");
  console.log(JSON.stringify(result, null, 2));
})();
