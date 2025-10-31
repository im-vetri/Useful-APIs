# 🎨 Color Palette Generator API

This API generates beautiful color palettes — random or theme-based — in seconds.

## 🚀 Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/palette/random` | Generates a random color palette. |
| GET | `/api/palette/theme/:theme` | Generates a theme-based palette. Themes: pastel, vibrant, dark, neon. |

## 🧩 Example Response
```json
{
  "palette": ["#F9A8D4", "#FECACA", "#C4B5FD", "#FDE68A", "#A7F3D0"]
}

