const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // On importe la connexion MySQL

const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Pour lire le JSON envoyé dans les requêtes
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Cette ligne est CRUCIALRE pour le CSS et les images
app.use(express.static(path.join(__dirname, 'public')));



// Route de test
app.get('/', (req, res) => {
    res.send('L\'API Asimov est en ligne !');
});

// Route pour tester la BDD : on récupère les élèves
app.get('/test-db', (req, res) => {
    db.query('SELECT * FROM eleves', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});

const stageRoutes = require('./routes/stageRoutes');
const projetRoutes = require('./routes/projetRoutes');

// On dit à Express : "Toutes les routes commençant par /stages utilisent stageRoutes"
app.use('/stages', stageRoutes);

// On dit à Express : "Toutes les routes commençant par /projet utilisent projetRoutes"
app.use('/projets', projetRoutes);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net; img-src 'self' data:;"
  );
  next();
});