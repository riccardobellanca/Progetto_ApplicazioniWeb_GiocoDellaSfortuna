import { Router } from "express";
import * as demoController from "../controllers/demoController.js";

const router = Router();

router.post("", (req, res) => {
  try {
    res.status(201).json(demoController.createDemo(req));
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/guess", async (req, res) => {
  try {
    const result = await demoController.submitDemoGuess(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
