import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import db from "../db/database.js";

// Funzione per confrontare password
function verifyPassword(password, hash, salt) {
  const hashedAttempt = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hashedAttempt === hash;
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const sql = "SELECT * FROM utenti WHERE username = ?";
    db.get(sql, [username], (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Utente non trovato" });

      // Verifica password con salt e hash salvati
      const passwordOk = verifyPassword(password, user.hash, user.salt);
      if (!passwordOk)
        return done(null, false, { message: "Password errata" });

      // Login riuscito
      return done(null, { userId: user.userId, username: user.username });
    });
  })
);

// Serialize e deserialize
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser((id, done) => {
  const sql = "SELECT userId, username FROM utenti WHERE userId = ?";
  db.get(sql, [id], (err, row) => {
    if (err) return done(err);
    if (!row) return done(null, false);
    done(null, { userId: row.userId, username: row.username });
  });
});

export default passport;