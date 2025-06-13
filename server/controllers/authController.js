import { createUser, rejectIfFindUserByUsername } from "../dao/UserDAO.js";
import { validationResult } from "express-validator";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import db from "../db/database.js";
import passport from "passport";

export const register = async (req) => {
  const { username, password } = req.body;
  try {
    await rejectIfFindUserByUsername(username);
    const result = await createUser(username, password);
    const user = {
      userId: result.userId,
      username: result.username,
    };

    await new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      data: err,
    };
  }
};

export const login = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return reject(err);
      if (!user)
        return resolve({ success: false, data: { code: 500, message: info } });

      req.login(user, (err) => {
        if (err) {
          return resolve({
            success: false,
            data: { code: 500, message: "Impossibile effettuare il login" },
          });
        }
        return resolve({ success: true, data: req.user });
      });
    })(req, res, next);
  });
};

export const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, data: {code: 401, message: "Non autorizzato"} });
  }
  next();
};

export const requireOwnership = (req, res, next) => {
  if (!req.user || req.user.userId !== parseInt(req.params.profileId)) {
    return res.status(403).json({ success: false, data: {code: 403, message: "Accesso negato"} });
  }
  next();
};

export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors
        .array()
        .map((e) => e.msg)
        .join(", "),
    });
  }
  return next();
};

export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const sql = "SELECT * FROM utenti WHERE username = ?";
    db.get(sql, [username], (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Utente non trovato" });

      const passwordOk = verifyPassword(password, user.hash, user.salt);
      if (!passwordOk)
        return done(null, false, { message: "Password errata" });

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

function verifyPassword(password, hash, salt) {
  const hashedAttempt = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hashedAttempt === hash;
}

export default passport;