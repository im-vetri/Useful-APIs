// apis/dictionary/dictionary.js
/**
 * Dictionary API
 * Fetches word definitions, parts of speech, and example sentences.
 * Works in both Node.js and browser environments.
 */

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

/**
 * Get definition(s) for a given word.
 * @param {string} word - The word to look up.
 * @returns {Promise<Object>} The word's meaning, part of speech, and example.
 */
async function getWordMeaning(word) {
  if (!word || typeof word !== "string") {
    throw new Error("Please provide a valid word as a string.");
  }

  try {
    const response = await fetch(`${BASE_URL}/${word}`);
    if (!response.ok) throw new Error("Word not found!");
    const data = await response.json();

    const entry = data[0];
    const meanings = entry.meanings.map(m => ({
      partOfSpeech: m.partOfSpeech,
      definition: m.definitions[0].definition,
      example: m.definitions[0].example || "No example available."
    }));

    return {
      word: entry.word,
      phonetic: entry.phonetic || "N/A",
      meanings
    };
  } catch (error) {
    console.error("Error fetching meaning:", error.message);
    throw error;
  }
}

// For Node.js compatibility
if (typeof module !== "undefined") {
  module.exports = { getWordMeaning };
}
