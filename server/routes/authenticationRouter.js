import { Router } from "express";
import { createUser } from "../dao/UserDAO.js";
import passport from "../auth/passport-config.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username e/o Password richiesti per la registrazione" });
  try {
    const result = await createUser(username, password);
    const user = {
      userId: result.userId,
      username: result.username,
    };

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json(user);
    });
  } catch (err) {
    return res.status(500).json({ error: "Impossibile effettuare la registrazione" });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ error: info?.message || "Impossibile effettuare il login" });
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json(req.user);
    });
  })(req, res, next);
});

router.delete("/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

export default router;
