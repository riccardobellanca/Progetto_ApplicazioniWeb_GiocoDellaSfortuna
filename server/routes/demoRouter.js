import { Router } from "express";
import { createDemo, submitDemoGuess} from "../controllers/demoController.js";

const router = Router();

router.get("", async (req, res) => {
  const result = await createDemo(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});

router.post("/guess", async (req, res) => {
  const result = await submitDemoGuess(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});
export default router;
