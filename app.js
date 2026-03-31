const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // On importe la connexion MySQL

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Pour lire le JSON envoyé dans les requêtes

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