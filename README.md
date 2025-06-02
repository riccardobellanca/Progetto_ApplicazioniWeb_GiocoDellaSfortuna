[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #N: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

### Table `utenti`
- **userId**: chiave primaria auto-incrementale
- **username**: univoco, viene utilizzato per fare il login
- **salt**: utilizzato per l'hashing della password
- **hash**: password hashata con salt
- **createdAt**: timestamp di registrazione

Contiene le informazioni degli utenti registrati che possono giocare partite complete e vedere la cronologia.

### Table `carte`
- **cardId**: chiave primaria auto-incrementale
- **name**: nome della situazione orribile (univoco)
- **description**: descrizione breve della situazione
- **imageUrl**: URL dell'immagine rappresentativa
- **misfortuneIndex**: indice di sfortuna da 1 a 100 (univoco, DECIMAL per supportare .5)

Contiene tutte le 50+ carte delle situazioni orribili con i loro dettagli e indici di sfortuna univoci.

### Table `partite`
- **gameId**: chiave primaria auto-incrementale
- **userId**: foreign key che referenzia userId della tabella users
- **status**: può essere "in_progress", "won", "lost"
- **createdAt**: timestamp di inizio partita
- **totalCardsWon**: numero di carte vinte nella partita

Traccia ogni partita giocata dagli utenti registrati con il suo stato e statistiche finali.

### Table `rounds`
- **roundId**: chiave primaria auto-incrementale
- **gameId**: foreign key che referenzia gameId della tabella games
- **cardId**: foreign key che referenzia cardId della tabella cards
- **roundNumber**: numero progressivo del round nella partita
- **isWon**: boolean che indica se il round è stato vinto
- **playedAt**: timestamp del round

Registra ogni singolo round di una partita, quale carta è stata presentata e se è stata vinta o persa.

### Table `carte_del_gioco`
- **gameId**: foreign key che referenzia gameId della tabella games
- **cardId**: foreign key che referenzia cardId della tabella cards
- **position**: posizione della carta (0-5 per le carte possedute)
- **acquiredInRound**: numero del round in cui è stata acquisita (NULL per le 3 iniziali)

Gestisce le carte possedute dal giocatore in ogni partita, incluse le 3 iniziali e quelle vinte nei round.

## Relazioni

- **users** (1) → (N) **games**: Un utente può giocare molte partite
- **games** (1) → (N) **game_rounds**: Una partita ha molti round
- **games** (1) → (N) **game_cards**: Una partita ha da 3 a 6 carte possedute
- **cards** (1) → (N) **game_rounds**: Una carta può apparire in molti round (di partite diverse)
- **cards** (1) → (N) **game_cards**: Una carta può essere posseduta in molte partite

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
