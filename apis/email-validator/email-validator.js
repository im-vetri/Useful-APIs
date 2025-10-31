import express from "express";
import validator from "validator";

const app = express();
const PORT = 3003;

app.get("/api/validate/:email", (req, res) => {
  const { email } = req.params;
  const isValid = validator.isEmail(email);
  const domain = email.split("@")[1];
  res.json({ email, valid: isValid, domain });
});

app.listen(PORT, () => console.log(`📧 Email Validator API running on port ${PORT}`));
