import { Router } from "express";
import { requireAuth } from "../controllers/authController.js";
import { createGame, submitGuess } from "../controllers/gameController.js";
import { body } from "express-validator";
import { checkValidation } from "../controllers/authController.js";

const router = Router();

const validateGuess = [
  body("position")
    .notEmpty()
    .withMessage("Position è richiesta")
    .isInt({ min: -1, max: 6 })
    .withMessage(
      "Position deve essere un intero con valore compreso fra -1 e 6"
    ),
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

export default router;
