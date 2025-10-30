// examples/dictionary-node.js
const { getWordMeaning } = require("../apis/Dictionary/dictionary.js");

(async () => {
  const word = "inspire";
  const result = await getWordMeaning(word);
  console.log(JSON.stringify(result, null, 2));
})();
