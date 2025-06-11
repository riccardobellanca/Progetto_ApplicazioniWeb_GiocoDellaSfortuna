import { Router } from "express";
import * as gameController from "../controllers/gameController.js";
import { requireAuth } from "../controllers/authController.js";
import { createGame } from "../controllers/gameController.js";

const router = Router();

router.get("", requireAuth, async (req, res) => {
  const result = await createGame(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});

router.post("/guess", requireAuth, async (req, res) => {
  const result = await gameController.submitGuess(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});
export default router;
