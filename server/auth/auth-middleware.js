import { validationResult } from 'express-validator';

export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: 'Not authorized' });
};

export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array().map(e => e.msg).join(', ') });
    }
    return next();
};

export const logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return res.status(500).json({ error: 'Logout failed' }); }
    res.status(200).json({ message: 'Logout successful' });
  });
};

 
