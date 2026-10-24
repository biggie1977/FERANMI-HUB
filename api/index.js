const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const frontendDir = path.join(__dirname, '..', 'frontend');
const DB = path.join(__dirname, '..', 'backend', 'enquiries.json');
const ADMIN_KEY = process.env.ADMIN_KEY || '';

const readEnquiries = () => {
  if (!fs.existsSync(DB)) return [];

  try {
    return JSON.parse(fs.readFileSync(DB, 'utf8'));
  } catch (_error) {
    return [];
  }
};

const looks = [
  { id: 1, title: 'Look 01', pieces: ['Denim jacket', 'Baggy jeans', 'Sneakers'], tags: ['denim', 'outerwear'] },
  { id: 2, title: 'Look 02', pieces: ['Jersey', 'Cargo pants', 'Sneakers'], tags: ['sport'] },
  { id: 3, title: 'Look 03', pieces: ['Puffer jacket', 'Baggy jeans', 'Boots'], tags: ['outerwear', 'denim'] },
  { id: 4, title: 'Look 04', pieces: ['Hoodie', 'Baggy jeans', 'Sneakers'], tags: ['denim'] },
];

const rate = new Map();

app.use(express.json({ limit: '20kb' }));
app.use(express.static(frontendDir));

app.get('/api/looks', (_req, res) => {
  res.json(looks);
});

app.post('/api/contact', (req, res) => {
  const ip = req.ip || 'unknown';
  const hits = (rate.get(ip) || []).filter((time) => Date.now() - time < 3600e3);

  if (hits.length >= 5) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  const { name, email, service, message } = req.body || {};

  if (!name || !/\S+@\S+\.\S+/.test(email || '') || !message) {
    return res.status(400).json({ error: 'Name, valid email and message are required.' });
  }

  const entry = {
    id: Date.now(),
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 150),
    service: String(service || '').slice(0, 60),
    message: String(message).slice(0, 2000),
    at: new Date().toISOString(),
  };

  const saved = [...readEnquiries(), entry];
  fs.writeFileSync(DB, JSON.stringify(saved, null, 2));

  rate.set(ip, [...hits, Date.now()]);
  return res.status(201).json({ ok: true });
});

app.get('/api/enquiries', (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) {
    return res.sendStatus(401);
  }

  return res.json(readEnquiries());
});

app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'favicon.ico'));
});

app.get(/^\/(?!api\/).*$/, (req, res) => {
  const candidate = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');
  const target = path.join(frontendDir, candidate);

  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    return res.sendFile(target);
  }

  return res.sendFile(path.join(frontendDir, 'index.html'));
});

if (process.env.VERCEL !== '1' && require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`STYLEDBYGBABY running on :${port}`);
  });
}

module.exports = app;
