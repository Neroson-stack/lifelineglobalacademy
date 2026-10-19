
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`LIFELINE GLOBAL ACADEMY SMS running on http://localhost:${PORT}`);
  console.log(`API base: http://localhost:${PORT}/api`);
  console.log(`Health:   http://localhost:${PORT}/api/health`);
});
