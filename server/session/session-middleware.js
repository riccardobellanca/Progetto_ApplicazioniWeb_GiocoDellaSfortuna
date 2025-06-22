import session from "express-session";

const sessionMiddleware = session({
  secret: "StuffHappens",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true in produzione con HTTPS
    sameSite: "lax", // importante per CORS
  },
});

export default sessionMiddleware;
