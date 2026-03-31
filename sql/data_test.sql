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