import sqlite3 from "sqlite3";

// Creazione del database
const database_path = "./db/";
const database_name = "db.sqlite";
console.log(`Creating database at ${database_path + database_name}...`);
const db = new sqlite3.Database(database_path + database_name, (err) => {
  if (err) {
    console.log("Error creating database!");
    throw err;
  } else {
    console.log("Succesfully connected to database!");
  }
});
/*
// Inizializzazione del database
const sql = "SELECT * FROM process";
db.get(sql, (err, row) => {
  if (err) throw err;
  if (row === undefined) {
    const sql = "INSERT INTO process VALUES (0,0)";
    db.run(sql, function (err) {
      if (err) throw err;
    });
  }
});
*/
export default db;
