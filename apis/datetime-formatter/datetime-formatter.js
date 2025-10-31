import express from "express";
import moment from "moment-timezone";

const app = express();
const PORT = 3002;

app.get("/api/now", (req, res) => {
  const now = new Date();
  res.json({
    iso: now.toISOString(),
    formatted: moment(now).format("DD-MM-YYYY HH:mm:ss")
  });
});

app.get("/api/format/:timestamp", (req, res) => {
  const { timestamp } = req.params;
  res.json({
    original: timestamp,
    formatted: moment(parseInt(timestamp)).format("DD-MM-YYYY HH:mm:ss")
  });
});

app.listen(PORT, () => console.log(`⏰ Date Formatter API running on port ${PORT}`));
