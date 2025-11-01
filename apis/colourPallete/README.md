# 🎨 Color Palette Generator
## 🧩 Because
A simple JavaScript utility that generates random or theme-based color palettes — no server or API required.
## ✨ Features
- Generates 5-color palettes instantly
- Supports multiple themes: `pastel`, `vibrant`, `dark`, `neon`, `random`
- Lightweight and dependency-free (uses `randomcolor`)
## 🚀 Results
**Usage:**
```
import { generatePalette } from "./color-palette-generator.js";

console.log(generatePalette("vibrant"));
```

**Example Output:**
```
["#FCA5A5", "#F87171", "#EF4444", "#DC2626", "#B91C1C"]
```

**Function:**
| Function | Description | Example |
|----------|-------------|---------|
| `generatePalette(theme)` | Returns an array of 5 colors based on the theme | `generatePalette("pastel")` |

**Themes:**
- 🎨 `pastel` – soft and light colors
- 🌈 `vibrant` – bold, saturated tones
- 🌙 `dark` – muted, darker shades
- 💡 `neon` – bright, glowing tones
- 🔀 `random` – fully randomized palette
## 🔗 Closes
Closes #[issue-number] — Adds **Color Palette Generator**.

📝 License: MIT License © 2025
