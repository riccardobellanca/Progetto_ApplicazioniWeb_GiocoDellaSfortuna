import { Router } from "express";
import { retrieveImage } from "../controllers/imagesController.js";
import {requireAuth} from "../controllers/authController.js"

const router = Router();

router.get("/:imageName", (req, res, next) => {
  const result = retrieveImage(req.params.imageName);
  res.status(result.success ? 200 : result.data.code).json(result);
});

export default router;