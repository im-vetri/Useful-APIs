import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3004;
app.use(bodyParser.json());

app.post("/api/check", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strength = ["Weak", "Medium", "Strong", "Very Strong"][score - 1] || "Very Weak";
  res.json({ password, score, strength });
});

app.listen(PORT, () => console.log(`🔐 Password Checker API running on port ${PORT}`));
