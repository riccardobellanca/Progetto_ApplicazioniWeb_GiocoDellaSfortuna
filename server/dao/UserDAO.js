import db from "../db/database.js";
import crypto from "crypto";

/**
 * Crea un nuovo utente
 */
export async function createUser(username, password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  const createdAt = new Date().toISOString();

  const sql =
    "INSERT INTO utenti (username, salt, hash, createdAt) VALUES (?, ?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.run(sql, [username, salt, hash, createdAt], function (error) {
      if (error) reject({ code: 500, message: "Impossibile creare l'utente" });
      else resolve({ userId: this.lastID, username });
    });
  });
}

/**
 * Verifica se un utente esiste già nel database
 */
export async function rejectIfFindUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM utenti WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err)
        reject({ code: err.code, message: err.message });
      else if (row)
        reject({
          code: 409,
          message: "Un utente con questo username esiste già",
        });
      else resolve();
    });
  });
}

/**
 * Restituisce le informazioni fondamentali di un utente sulla base del suo username e della sua password
 */
export async function getUserByCredentials(username, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM utenti WHERE username = ?";

    db.get(sql, [username], (err, row) => {
      if (err)
        return reject({
          code: err.code,
          message: err.message,
        });
      if (!row) return resolve(null);
      const hash = crypto
        .pbkdf2Sync(password, row.salt, 10000, 64, "sha512")
        .toString("hex");
      if (hash !== row.hash) return resolve(null);
      else resolve({ userId: row.userId, username: row.username });
    });
  });
}

/**
 * Restituisce un utente sulla base del suo identificativo
 */
export async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT userId,username,createdAt FROM utenti WHERE userId = ?";

    db.all(sql, [userId], (err, row) => {
      if (err)
        return reject({
          code: err.code,
          message: err.message,
        });
      resolve(row);
    });
  });
}
