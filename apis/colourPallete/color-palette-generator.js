import express from "express";
import randomcolor from "randomcolor";

const app = express();
const PORT = process.env.PORT || 3000;

const generatePalette = (theme) => {
  return randomcolor({
    count: 5,
    luminosity: theme === "dark" ? "dark" : "bright",
    hue: theme === "pastel" ? "pink" : theme === "neon" ? "green" : "random"
  });
};

app.get("/api/palette/random", (req, res) => {
  res.json({ palette: generatePalette("random") });
});

app.get("/api/palette/theme/:theme", (req, res) => {
  const theme = req.params.theme;
  res.json({ theme, palette: generatePalette(theme) });
});

app.listen(PORT, () => console.log(`🎨 Color Palette API running on port ${PORT}`));
