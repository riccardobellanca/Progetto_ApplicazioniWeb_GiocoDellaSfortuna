import { Router } from "express";
import { requireAuth } from "../controllers/authController.js";
import { createGame, submitGuess, startGameTimer } from "../controllers/gameController.js";
import { body } from "express-validator";
import { checkValidation } from "../controllers/authController.js";

const router = Router();

const validateGuess = [
  body("position")
    .notEmpty()
    .withMessage("Position è richiesta.")
    .isInt({ min: -1, max: 6 })
    .withMessage(
      "Position deve essere un intero con valore compreso fra -1 e 6."
    ),
];

const validateTimer = [
  body("startTime")
    .notEmpty()
    .withMessage("StartTime è richiesto")
    .isInt({ min: 0 })
    .withMessage("StartTime deve essere un timestamp valido"),
];

router.get("", requireAuth, async (req, res) => {
  const result = await createGame(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});

router.post(
  "/guess",
  requireAuth,
  validateGuess,
  checkValidation,
  async (req, res) => {
    const result = await submitGuess(req);
    res.status(result.success ? 200 : result.data.code).json(result);
  }
);

router.post(
  "/timer",
  requireAuth,
  validateTimer,
  checkValidation,
  async (req, res) => {
    const result = await startGameTimer(req);
    res.status(result.success ? 200 : result.data.code).json(result);
  }
);

export default router;
