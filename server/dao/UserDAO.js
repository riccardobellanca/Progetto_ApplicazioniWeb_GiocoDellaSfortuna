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
        resolve({
          success: true,
          userId: this.lastID,
          username: username,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getUserByCredentials(username, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM utenti WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      const hashFromDB = row.hash;
      const salt = row.salt;
      const hashBuffer = Buffer.from(hashFromDB, "hex");

      crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
        if (err) return reject(err);

        if (!crypto.timingSafeEqual(hashBuffer, derivedKey))
          return resolve(null);

        const user = { id: row.id, username: row.username };
        resolve(user);
      });
    });
  });
}
