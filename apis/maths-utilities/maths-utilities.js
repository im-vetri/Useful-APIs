import express from "express";
const app = express();
const PORT = 3001;

app.get("/api/add/:a/:b", (req, res) => {
  const { a, b } = req.params;
  res.json({ result: Number(a) + Number(b) });
});

app.get("/api/factorial/:n", (req, res) => {
  const n = parseInt(req.params.n);
  const fact = (num) => (num <= 1 ? 1 : num * fact(num - 1));
  res.json({ n, factorial: fact(n) });
});

app.get("/api/prime/:n", (req, res) => {
  const n = parseInt(req.params.n);
  const isPrime = n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every(i => n % i !== 0);
  res.json({ n, isPrime });
});

app.listen(PORT, () => console.log(`🧮 Math API running on port ${PORT}`));
