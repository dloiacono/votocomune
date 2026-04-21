-- Utenti
INSERT INTO utente (id, username, password_hash, nome, cognome, email)
VALUES (1, 'admin', '$2a$12$OcQvb7ujYBgRxjsnmqeA3O4pLLUVv2OHP5i2wL5ft07WIDyLkGBWS', 'Amministratore', 'Sistema', 'admin@comunali.app');

INSERT INTO utente_profili (utente_id, profilo) VALUES (1, 'ADMIN');
INSERT INTO utente_profili (utente_id, profilo) VALUES (1, 'GESTORE_CANDIDATI');
INSERT INTO utente_profili (utente_id, profilo) VALUES (1, 'GESTORE_LISTE');
INSERT INTO utente_profili (utente_id, profilo) VALUES (1, 'GESTORE_VOTI');

-- Sezioni (20 sezioni)
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (1, 1, 'Scuola Media Mazzini', 450, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (2, 2, 'Scuola Primaria Garibaldi', 480, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (3, 3, 'Liceo Scientifico Da Vinci', 520, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (4, 4, 'Palestra Comunale', 410, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (5, 5, 'Centro Ricreativo', 470, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (6, 6, 'Auditorium Civico', 500, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (7, 7, 'Biblioteca Comunale', 430, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (8, 8, 'Chiesa Parrocchiale', 460, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (9, 9, 'Scuola dell''Infanzia', 400, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (10, 10, 'Circolo Ricreativo', 490, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (11, 11, 'Caserma Vigili Fuoco', 420, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (12, 12, 'Ospedale Civile', 510, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (13, 13, 'Centro Anziani', 380, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (14, 14, 'Parco Pubblico', 550, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (15, 15, 'Stazione Ferroviaria', 440, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (16, 16, 'Mercato Coperto', 470, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (17, 17, 'Museo Civico', 390, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (18, 18, 'Teatro Comunale', 530, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (19, 19, 'Piscina Comunale', 450, false);
INSERT INTO sezione (id, numero, nome, aventi_diritto, scrutinata) VALUES (20, 20, 'Palazzetto dello Sport', 480, false);

-- Liste Elettorali (3 liste)
INSERT INTO lista_elettorale (id, numero, nome, simbolo, colore) VALUES (1, 1, 'Lista A - Centro Sinistra', 'Rosa', '#FF69B4');
INSERT INTO lista_elettorale (id, numero, nome, simbolo, colore) VALUES (2, 2, 'Lista B - Centro Destra', 'Sole', '#FFD700');
INSERT INTO lista_elettorale (id, numero, nome, simbolo, colore) VALUES (3, 3, 'Lista C - Sinistra', 'Stella', '#FF0000');

-- Candidati Sindaci (2 sindaci)
INSERT INTO candidato_sindaco (id, nome, cognome, foto) VALUES (1, 'Marco', 'Rossi', NULL);
INSERT INTO candidato_sindaco (id, nome, cognome, foto) VALUES (2, 'Anna', 'Bianchi', NULL);

-- Coalizioni Sindaci-Liste
INSERT INTO sindaco_liste (sindaco_id, lista_id) VALUES (1, 1);
INSERT INTO sindaco_liste (sindaco_id, lista_id) VALUES (1, 2);
INSERT INTO sindaco_liste (sindaco_id, lista_id) VALUES (2, 3);

-- Candidati Consiglieri per Lista A (5 consiglieri)
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (1, 'Paolo', 'Ferrari', 1, 1);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (2, 'Laura', 'Rossi', 1, 2);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (3, 'Giovanni', 'Verdi', 1, 3);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (4, 'Maria', 'Neri', 1, 4);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (5, 'Antonio', 'Marrone', 1, 5);

-- Candidati Consiglieri per Lista B (5 consiglieri)
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (6, 'Francesca', 'Giallo', 2, 1);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (7, 'Carlo', 'Blu', 2, 2);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (8, 'Elena', 'Arancio', 2, 3);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (9, 'Michele', 'Viola', 2, 4);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (10, 'Giulia', 'Indaco', 2, 5);

-- Candidati Consiglieri per Lista C (5 consiglieri)
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (11, 'Davide', 'Cremisi', 3, 1);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (12, 'Silvia', 'Scarlatto', 3, 2);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (13, 'Roberto', 'Bordo', 3, 3);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (14, 'Alessandra', 'Magenta', 3, 4);
INSERT INTO candidato_consigliere (id, nome, cognome, lista_id, ordine_lista) VALUES (15, 'Luca', 'Turchese', 3, 5);

-- Reset H2 sequences to avoid ID collisions on new inserts
-- Hibernate generates sequences as <EntityName>_SEQ or snake_case depending on naming strategy
ALTER SEQUENCE IF EXISTS Utente_SEQ RESTART WITH 100;
ALTER SEQUENCE IF EXISTS Sezione_SEQ RESTART WITH 100;
ALTER SEQUENCE IF EXISTS ListaElettorale_SEQ RESTART WITH 100;
ALTER SEQUENCE IF EXISTS CandidatoSindaco_SEQ RESTART WITH 100;
ALTER SEQUENCE IF EXISTS CandidatoConsigliere_SEQ RESTART WITH 100;
ALTER SEQUENCE IF EXISTS VotoSezione_SEQ RESTART WITH 100;
ALTER SEQUENCE IF EXISTS PreferenzaConsigliere_SEQ RESTART WITH 100;
-- Also try snake_case variants for naming strategy
ALTER SEQUENCE IF EXISTS utente_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS sezione_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS lista_elettorale_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS candidato_sindaco_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS candidato_consigliere_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS voto_sezione_seq RESTART WITH 100;
ALTER SEQUENCE IF EXISTS preferenza_consigliere_seq RESTART WITH 100;
