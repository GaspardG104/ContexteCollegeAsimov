INSERT INTO parents (nom, prenom, email) 
VALUES ('Vernes', 'Pierre', 'p.vernes@email.fr');

INSERT INTO classes (niveau, lettre, annee_scolaire) 
VALUES (6, 'A', '2025-2026');

INSERT INTO eleves (nom, prenom, identifiant_import, id_parent, id_classe_actuelle) 
VALUES ('Vernes', 'Jules', 'jvernes01', 1, 1);

INSERT INTO enseignants (nom, prenom) VALUES 
('Durand', 'Sophie'),
('Lemoine', 'Marc'),
('Rousseau', 'Claire'),
('Garnier', 'Lucas');

INSERT INTO stages (id_eleve, entreprise, coordonnees_contact, etat_convention) 
VALUES (1, 'GGGCorp', '07 07 07 07 07', 'Vierge');

INSERT INTO stage_recherches (id_eleve, entreprise_contactee, nb_lettres_envoyees, nb_lettres_recues, resultat) 
VALUES (1, 'GGGCorp', 12, 1,'en attente');

INSERT INTO projets (libelle, description, date_debut, date_fin, id_eleve_responsable, est_valide) 
VALUES 
('Club Robotique', 'Construction d un robot explorateur pour le concours inter-collèges.', '2024-01-15', '2024-06-30', 1, TRUE),
('Journal du Collège', 'Rédaction et mise en page du mensuel "L Asimov Déchaîné".', '2023-09-01', NULL, 1, TRUE),
('Potager Solidaire', 'Création d un espace de culture de légumes bio dans la cour arrière.', '2024-03-10', '2024-05-20', 1, FALSE);

INSERT INTO eleve_projets (id_eleve, id_projet, date_debut_participation, date_fin_participation) 
VALUES 
(1, 1, '2024-01-15', NULL), -- Participation active au Club Robotique
(1, 2, '2023-09-01', NULL), -- Participation active au Journal
(1, 3, '2024-03-10', '2024-05-20'); -- Participation terminée au Potager