// STYLEDBYGBABY backend
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const frontendDir = path.join(__dirname, '..', 'frontend');
const DB = path.join(__dirname, 'enquiries.json');
const ADMIN_KEY = process.env.ADMIN_KEY || '';

const read = () => (fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf8')) : []);

app.use(express.json({ limit: '20kb' }));
app.use(express.static(frontendDir));

const looks = [
  { id: 1, title: 'Look 01', pieces: ['Denim jacket', 'Baggy jeans', 'Sneakers'], tags: ['denim', 'outerwear'] },
  { id: 2, title: 'Look 02', pieces: ['Jersey', 'Cargo pants', 'Sneakers'], tags: ['sport'] },
  { id: 3, title: 'Look 03', pieces: ['Puffer jacket', 'Baggy jeans', 'Boots'], tags: ['outerwear', 'denim'] },
  { id: 4, title: 'Look 04', pieces: ['Hoodie', 'Baggy jeans', 'Sneakers'], tags: ['denim'] },
];

app.get('/api/looks', (_req, res) => res.json(looks));

const rate = new Map();

app.post('/api/contact', (req, res) => {
  const hits = (rate.get(req.ip) || []).filter(t => Date.now() - t < 3600e3);
  if (hits.length >= 5) return res.status(429).json({ error: 'Too many requests. Try again later.' });

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

  fs.writeFileSync(DB, JSON.stringify([...read(), entry], null, 2));
  rate.set(req.ip, [...hits, Date.now()]);
  res.status(201).json({ ok: true });
});

app.get('/api/enquiries', (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) return res.sendStatus(401);
  res.json(read());
});

app.listen(process.env.PORT || 3000, () => {
  console.log('STYLEDBYGBABY running on :3000');
});
