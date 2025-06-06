// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from './auth/passport-config.js';
import sessionMiddleware from './auth/session-middleware.js';

import { CONFIG } from './config/config.js';
import authenticationRouter from './routes/authenticationRouter.js';

// to clean terminal
const blank = '\n'.repeat(process.stdout.rows);
console.log(blank);
readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

// init express
const app = new express();
const port = CONFIG.PORT;

// logs http requests
app.use(express.json())
app.use(morgan('dev'));

// handle cross-origin resource sharing
app.use(cors({
    origin: CONFIG.REACT_SERVER_BASE_URL,
    credentials: true,
}));

// session + passport
app.use(sessionMiddleware);
app.use(passport.authenticate('session'));

// middleware
app.use(CONFIG.AUTH_ROUTES, authenticationRouter);
app.use(CONFIG.USER_ROUTES, authenticationRouter);



// server listening...
app.listen(port, () => {
  console.log(`\nServer listening at http://localhost:${port}`);
});