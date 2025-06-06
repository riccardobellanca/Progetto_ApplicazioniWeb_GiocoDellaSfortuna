import sqlite3 from "sqlite3";

const database_path = "./db/";
const database_name = "database.sqlite";
const sql = "SELECT username FROM utenti";

// Creazione del database
const db = new sqlite3.Database(database_path + database_name, (err) => {
  if (err) {
    console.log("Error connecting to database!");
    throw err;
  } else {
    console.log("Connected to database at " + database_path + database_name);
  }
});

let result = [];

/*
// Visualizzazione dati tabella UTENTI
db.all(sql, (err, rows) => {
  if (err) {
    console.error("Errore nella query:", err.message);
    return;
  }

  // Stampa tutti gli utenti
  console.log("\nTABLE utenti:");
  rows.forEach((row, index) => {
    console.log(`Utente ${index + 1}: ${JSON.stringify(row)}`);
  });
});
*/

export default db;
