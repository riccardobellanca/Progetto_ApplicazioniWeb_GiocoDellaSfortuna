import { Router } from "express";
import {
  register,
  login,
  requireAuth,
  checkValidation,
} from "../controllers/authController.js";
import { body } from "express-validator";

const router = Router();

const validateRegister = [
  body("username")
    .isLength({ min: 4, max: 30 })
    .withMessage("Username deve essere tra 4 e 30 caratteri")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username può contenere solo lettere, numeri e underscore"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La password deve essere di almeno 6 caratteri")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"
    ),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Le due password non coincidono");
      }
      return true;
    })
];

const validateLogin = [
  body("username")
    .notEmpty()
    .withMessage("Username è richiesto")
    .trim(),

  body("password")
    .notEmpty()
    .withMessage("Password è richiesta")
];

router.post("/register", validateRegister, checkValidation, async (req, res) => {
  try {
    const response = await register(req);
    const statusCode = response.success ? 201 : (response.data?.code || 400);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      data: { message: "Errore interno del server", code: 500 }
    });
  }
});

router.post("/login", validateLogin, checkValidation, async (req, res, next) => {
  try {
    const response = await login(req, res, next);
    const statusCode = response.success ? 200 : (response.data?.code || 400);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      data: { message: "Errore interno del server", code: 500 }
    });
  }
});

router.post("/logout", (req, res) => {
  // Verifica se l'utente è autenticato
  if (!req.user) {
    return res.status(401).json({
      success: false,
      data: { message: "Utente non autenticato", code: 401 }
    });
  }

  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        data: { message: "Errore durante il logout", code: 500 },
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: {
            message: "Errore nella distruzione della sessione",
            code: 500,
          },
        });
      }
      
      res.status(200).json({
        success: true,
        data: { message: "Logout effettuato con successo" },
      });
    });
  });
});

router.get("/session", requireAuth, (req, res) => {
  const response = {
    success: true,
    data: {
      user: {
        id: req.user.id,
        username: req.user.username,
      }
    },
  };
  res.status(200).json(response);
});

export default router;