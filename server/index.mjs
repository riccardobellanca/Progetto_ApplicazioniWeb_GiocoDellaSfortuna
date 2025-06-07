// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from './auth/passport-config.js';
import sessionMiddleware from './auth/session-middleware.js';

import { CONFIG } from './config/config.js';
import { authenticationRouter } from './routes/authenticationRouter.js';
import { gameRouter } from './routes/gameRouter.js'
import { demoRouter } from './routes/demoRouter.js'
import { profileRouter } from "./routes/profileRouter.js"

// init express
export const app = new express();
const port = CONFIG.SERVER_PORT;

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
app.use(CONFIG.GAME_ROUTES, gameRouter);
app.use(CONFIG.DEMO_ROUTES, demoRouter);
app.use(CONFIG.PROFILE_ROUTES, profileRouter);

// server listening...
app.listen(port, () => {
  console.log(`\nServer listening at http://localhost:${port}`);
});