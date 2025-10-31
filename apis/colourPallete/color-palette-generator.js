import randomcolor from "randomcolor";

/**
 * Generates a color palette.
 * @param {string} theme - pastel | vibrant | dark | neon | random
 * @returns {string[]} - Array of color HEX codes
 */
export function generatePalette(theme = "random") {
  return randomcolor({
    count: 5,
    luminosity: theme === "dark" ? "dark" : "bright",
    hue:
      theme === "pastel"
        ? "pink"
        : theme === "neon"
        ? "green"
        : theme === "vibrant"
        ? "red"
        : "random",
  });
}

console.log(generatePalette("pastel"));
