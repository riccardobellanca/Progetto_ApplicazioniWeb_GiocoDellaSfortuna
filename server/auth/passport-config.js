import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDAO from '../dao/UserDAO.js';
import {getUserByCredentials} from UserDAO;

const userDao = new UserDAO();

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const member = await getUserByCredentials(username, password);
    if (!member) return cb(null, false, 'Incorrect username or password');
    return cb(null, member);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

export default passport;
