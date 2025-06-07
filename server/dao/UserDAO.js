import db from "../db/database.js";
import crypto from "crypto";

/**
* Crea nuovo utente con password hashata
*/
export async function createUser(username, password) {
 const salt = crypto.randomBytes(16).toString("hex");
 const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
 const createdAt = new Date().toISOString();
 
 const sql = "INSERT INTO utenti (username, salt, hash, createdAt) VALUES (?, ?, ?, ?)";
 
 return new Promise((resolve, reject) => {
   db.run(sql, [username, salt, hash, createdAt], function(error) {
     if (error) {
       reject(error);
     } else {
       resolve({ userId: this.lastID, username });
     }
   });
 });
}

/**
* Verifica credenziali utente
*/
export async function getUserByCredentials(username, password) {
 return new Promise((resolve, reject) => {
   const sql = "SELECT * FROM utenti WHERE username = ?";
   
   db.get(sql, [username], (err, row) => {
     if (err) return reject(err);
     if (!row) return resolve(null);
     
     const hash = crypto.pbkdf2Sync(password, row.salt, 10000, 64, "sha512").toString("hex");
     
     if (hash !== row.hash) return resolve(null);
     
     resolve({ userId: row.userId, username: row.username });
   });
 });
}