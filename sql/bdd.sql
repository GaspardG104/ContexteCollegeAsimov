-- ============================================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES ASIM'UT
-- Projet : Suivi de scolarité Collège-Lycée Asimov
-- ============================================================

-- Suppression des tables si elles existent (ordre inverse des dépendances)
DROP TABLE IF EXISTS stage_recherches;
DROP TABLE IF EXISTS stages;
DROP TABLE IF EXISTS eleve_projets;
DROP TABLE IF EXISTS projets;
DROP TABLE IF EXISTS eleve_options;
DROP TABLE IF EXISTS options;
DROP TABLE IF EXISTS moyennes;
DROP TABLE IF EXISTS eleves;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS enseignants;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS utilisateurs;

-- 1. Table des Utilisateurs (Gestion des accès et RGPD) [cite: 257, 258, 259]
CREATE TABLE utilisateurs (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Secretariat', 'Proviseur', 'Enseignant', 'Eleve') NOT NULL
);

-- 2. Table des Classes 
CREATE TABLE classes (
    id_classe INT AUTO_INCREMENT PRIMARY KEY,
    niveau INT NOT NULL CHECK (niveau BETWEEN 3 AND 6), -- Niveaux 6e à 3e
    lettre CHAR(1) NOT NULL, -- Ex: 'A', 'B', 'C'
    annee_scolaire VARCHAR(9) NOT NULL -- Ex: '2025-2026'
);

-- 3. Table des Enseignants [cite: 260]
CREATE TABLE enseignants (
    id_enseignant INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    id_utilisateur INT UNIQUE,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

-- 4. Table des Parents (Gérés séparément pour le publipostage) [cite: 413, 414]
CREATE TABLE parents (
    id_parent INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

-- 5. Table des Éleves [cite: 255, 412]
CREATE TABLE eleves (
    id_eleve INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    identifiant_import VARCHAR(50) UNIQUE NOT NULL, -- Identifiant du CSV [cite: 412]
    id_parent INT NOT NULL,
    id_enseignant_referent INT, -- Affecté par Round-Robin [cite: 263]
    id_classe_actuelle INT,
    id_utilisateur INT UNIQUE,
    FOREIGN KEY (id_parent) REFERENCES parents(id_parent),
    FOREIGN KEY (id_enseignant_referent) REFERENCES enseignants(id_enseignant),
    FOREIGN KEY (id_classe_actuelle) REFERENCES classes(id_classe),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

-- 6. Table des Moyennes (Historique par semestre) [cite: 255, 257]
CREATE TABLE moyennes (
    id_moyenne INT AUTO_INCREMENT PRIMARY KEY,
    id_eleve INT NOT NULL,
    semestre INT NOT NULL CHECK (semestre IN (1, 2)),
    note DECIMAL(4,2) NOT NULL,
    est_validee BOOLEAN DEFAULT FALSE, -- Validé par le proviseur [cite: 258]
    date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_eleve) REFERENCES eleves(id_eleve)
);

-- 7. Table des Options [cite: 410]
CREATE TABLE options (
    id_option INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL -- Ex: 'Informatique', 'Mécanique', 'Langue'
);

-- 8. Table de liaison Eleve <-> Options (Max 2 par élève) 
CREATE TABLE eleve_options (
    id_eleve INT NOT NULL,
    id_option INT NOT NULL,
    PRIMARY KEY (id_eleve, id_option),
    FOREIGN KEY (id_eleve) REFERENCES eleves(id_eleve),
    FOREIGN KEY (id_option) REFERENCES options(id_option)
);

-- 9. Table des Projets de l'établissement [cite: 271, 274]
CREATE TABLE projets (
    id_projet INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    date_debut DATE,
    date_fin DATE,
    id_eleve_responsable INT, -- Un élève peut être responsable d'un projet [cite: 274]
    FOREIGN KEY (id_eleve_responsable) REFERENCES eleves(id_eleve)
);

-- 10. Table de participation aux Projets (Suivi durée) [cite: 273]
CREATE TABLE eleve_projets (
    id_eleve INT NOT NULL,
    id_projet INT NOT NULL,
    date_debut_participation DATE,
    date_fin_participation DATE,
    PRIMARY KEY (id_eleve, id_projet),
    FOREIGN KEY (id_eleve) REFERENCES eleves(id_eleve),
    FOREIGN KEY (id_projet) REFERENCES projets(id_projet)
);

-- 11. Table des Stages (Conventions et attestations) [cite: 266, 268, 270]
CREATE TABLE stages (
    id_stage INT AUTO_INCREMENT PRIMARY KEY,
    id_eleve INT NOT NULL,
    entreprise VARCHAR(150) NOT NULL,
    coordonnees_contact TEXT,
    etat_convention ENUM('Vierge', 'Remplie', 'Validée') DEFAULT 'Vierge',
    chemin_pdf_convention VARCHAR(255), -- Chemin vers le fichier généré
    chemin_pdf_attestation VARCHAR(255), -- Chemin vers le fichier signé
    FOREIGN KEY (id_eleve) REFERENCES eleves(id_eleve)
);

-- 12. Table de suivi des recherches de stage (Alertes > 15) [cite: 267, 404, 405]
CREATE TABLE stage_recherches (
    id_recherche INT AUTO_INCREMENT PRIMARY KEY,
    id_eleve INT NOT NULL,
    entreprise_contactee VARCHAR(150) NOT NULL,
    nb_lettres_envoyees INT DEFAULT 0,
    nb_lettres_recues INT DEFAULT 0,
    date_entretien DATE,
    resultat TEXT,
    FOREIGN KEY (id_eleve) REFERENCES eleves(id_eleve)
);