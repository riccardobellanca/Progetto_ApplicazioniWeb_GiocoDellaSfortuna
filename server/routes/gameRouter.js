import { Router } from "express";
import { isLoggedIn } from "../auth/auth-middleware.js";
import * as gameController from "../controllers/gameController.js";

const router = Router();

router.post("", isLoggedIn, (req, res) => {
  try {
    res.status(201).json(gameController.createGame(req));
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/guess", isLoggedIn, (req, res) => {
  try {
    res.status(200).json(gameController.submitGuess(req));
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
