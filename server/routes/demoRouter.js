import { Router } from "express";
import { createDemo, submitDemoGuess} from "../controllers/demoController.js";
import { body } from "express-validator";
import { checkValidation } from "../controllers/authController.js";

const router = Router();

const validateGuess = [
  body("position")
    .notEmpty()
    .withMessage("Position è richiesta")
    .isInt({ min: 0, max: 6 })
    .withMessage(
      "Position deve essere un intero con valore compreso fra 0 e 6"
    ),
];

router.get("", async (req, res) => {
  const result = await createDemo(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});

router.post(
  "/guess",
  validateGuess,
  checkValidation,
  async (req, res) => {
    const result = await submitDemoGuess(req);
    res.status(result.success ? 200 : result.data.code).json(result);
  }
);

export default router;
