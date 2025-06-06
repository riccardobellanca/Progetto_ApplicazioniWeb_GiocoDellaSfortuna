import db from "../db/database.js";
import crypto from "crypto";

export async function createUser(username, password) {
  return new Promise((resolve, reject) => {
    try {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
      const createdAt = new Date().toISOString();
      const sql =
        "INSERT INTO utenti (username, salt, hash, createdAt) VALUES (?, ?, ?, ?)";
      db.run(sql, [username, salt, hash, createdAt], function (error) {
        if (error) return reject(error);
        else if (rows === undefined) reject("Impossibile salvare l'utente");
        resolve({
          success: true,
          userId: this.lastID,
          username: this.username,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getUserByCredentials(email, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM utenti WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve("Impossibile trovare l'utente desiderato");
      } else {
        const user = { id: row.id, username: row.email };
        const salt = row.salt;
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            resolve("La combinazione username-password non è corretta");
          else resolve(user);
        });
      }
    });
  });
}
