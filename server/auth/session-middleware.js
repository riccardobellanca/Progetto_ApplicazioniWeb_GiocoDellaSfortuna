import session from 'express-session';

const sessionMiddleware = session({
    secret: 'GiocoDellaSfortuna',
    resave: false,
    saveUninitialized: false,
});

export default sessionMiddleware;
