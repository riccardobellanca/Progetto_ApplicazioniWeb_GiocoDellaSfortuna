import { validationResult } from "express-validator";

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
    return res.status(422).json({
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
