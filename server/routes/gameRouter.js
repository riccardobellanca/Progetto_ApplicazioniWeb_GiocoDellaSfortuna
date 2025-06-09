import { Router } from "express";
import * as gameController from "../controllers/gameController.js";

const router = Router();

router.post("", (req, res) => {
  try {
    res.status(201).json(gameController.createGame(req));
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/guess", (req, res) => {
  try {
    res.status(200).json(gameController.submitGuess(req));
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
