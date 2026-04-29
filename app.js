const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

// Routes WEB
const stageRoutes = require('./routes/stageRoutes');
const projetRoutes = require('./routes/projetRoutes');

// Routes API (JSON pour JavaFX)
const ApiProjetRoutes = require('./api/routes/ApiProjetRoutes');
const ApiStageRoutes  = require('./api/routes/ApiStageRoutes');

const app = express();

// --- Middlewares globaux ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net; img-src 'self' data:;"
  );
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
app.get('/', (req, res) => res.render('index'));

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM eleves');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/projets', projetRoutes);
app.use('/api/projets', ApiProjetRoutes);
app.use('/stages', stageRoutes);
app.use('/api/stages', ApiStageRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

// --- Démarrage ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});