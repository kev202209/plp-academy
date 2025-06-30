// Simple Express server for Shared Shopping List MVP
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory store (for MVP)
let lists = [];

const DATA_FILE = './lists-data.json';

// Load lists from file if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    lists = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
} catch (e) {
  console.error('Failed to load data:', e);
}

function saveLists() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(lists, null, 2));
}

// SSE clients
let clients = [];

app.get('/api/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  res.write('retry: 10000\n\n');
  clients.push(res);
  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
});

function broadcastLists() {
  const data = `data: ${JSON.stringify(lists)}\n\n`;
  clients.forEach(res => res.write(data));
}

// Get all shopping lists
app.get('/api/lists', (req, res) => {
  res.json(lists);
});

// Create a new shopping list
app.post('/api/lists', (req, res) => {
  const { name, users, budget = null, subscription = false } = req.body;
  // Add payment status for each user
  const paymentStatus = (users || []).map(u => ({ user: u, paid: false }));
  const newList = { id: Date.now().toString(), name, users, items: [], budget, subscription, paymentStatus, receipts: [] };
  lists.push(newList);
  saveLists();
  broadcastLists();
  res.status(201).json(newList);
});

// Mark user as paid
app.post('/api/lists/:id/pay', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const list = lists.find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  const status = list.paymentStatus.find(s => s.user === user);
  if (status) status.paid = true;
  saveLists();
  broadcastLists();
  res.json(list.paymentStatus);
});

// Upload receipt (MVP: just store filename)
const upload = multer({ dest: 'uploads/' });
app.post('/api/lists/:id/receipt', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const list = lists.find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  if (req.file) list.receipts.push(req.file.filename);
  saveLists();
  broadcastLists();
  res.json({ receipts: list.receipts });
});

// Remove item from a list
app.delete('/api/lists/:id/items/:itemId', (req, res) => {
  const { id, itemId } = req.params;
  const list = lists.find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  list.items = list.items.filter(item => item.id !== itemId);
  saveLists();
  broadcastLists();
  res.status(204).end();
});

// Update budget or subscription
app.patch('/api/lists/:id', (req, res) => {
  const { id } = req.params;
  const { budget, subscription } = req.body;
  const list = lists.find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  if (budget !== undefined) list.budget = budget;
  if (subscription !== undefined) list.subscription = subscription;
  saveLists();
  broadcastLists();
  res.json(list);
});

// Split cost for a list (with budget info)
app.get('/api/lists/:id/split', (req, res) => {
  const { id } = req.params;
  const list = lists.find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  const total = list.items.reduce((sum, item) => sum + Number(item.price), 0);
  const perUser = total / list.users.length;
  const overBudget = list.budget ? total > Number(list.budget) : null;
  res.json({ total, perUser, users: list.users, budget: list.budget, overBudget });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
