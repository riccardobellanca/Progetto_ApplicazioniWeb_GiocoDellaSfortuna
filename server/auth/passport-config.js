import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByCredentials } from '../dao/UserDAO.js';

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUserByCredentials(username, password);
    if (!user) return cb(null, false, 'Username e/o Password non corretti');
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

export default passport;
