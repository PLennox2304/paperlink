const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const ADMIN_CODE = "416546";

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "codes.json";

// Hilfsfunktionen
function loadCodes() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveCodes(codes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(codes, null, 2));
}

// CODE ERSTELLEN
app.post("/api/create", (req, res) => {
  const { code, url } = req.body;
  if (!code || !url) return res.json({ error: "Fehlende Daten" });

  const codes = loadCodes();
  codes[code] = {
    url,
    createdAt: new Date().toISOString()
  };

  saveCodes(codes);
  res.json({ success: true });
});

// CODE AUFLÖSEN
app.get("/go/:code", (req, res) => {
  const codes = loadCodes();
  const entry = codes[req.params.code];

  if (!entry) return res.send("Code nicht gefunden");
  res.redirect(entry.url.startsWith("http") ? entry.url : "https://" + entry.url);
});

// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
  if (req.body.code === ADMIN_CODE) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ADMIN: CODES ABRUFEN
app.get("/api/admin/codes", (req, res) => {
  res.json(loadCodes());
});

// ADMIN: CODE LÖSCHEN
app.delete("/api/admin/code/:code", (req, res) => {
  const codes = loadCodes();
  delete codes[req.params.code];
  saveCodes(codes);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Paperlink läuft auf http://localhost:" + PORT);
});
