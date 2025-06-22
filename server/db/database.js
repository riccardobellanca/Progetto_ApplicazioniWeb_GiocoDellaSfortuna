import sqlite3 from "sqlite3";

const database_path = "./db/";
const database_name = "database.sqlite";

/**
 * Consente di connettere il server al database
 */
const db = new sqlite3.Database(database_path + database_name, (err) => {
  if (err) {
    console.log("Error connecting to database!");
    throw err;
  } else {
    console.log("Connected to database at " + database_path + database_name);
  }
});

export default db;
