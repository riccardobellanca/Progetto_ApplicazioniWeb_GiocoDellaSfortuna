import { Router } from "express";
import { isLoggedIn } from "../auth/auth-middleware.js";
import * as profileController from "../controllers/profileController.js";

const router = Router();

router.get("/:profileId", (req, res) => {
  try {
    res.status(200).json(profileController.getProfileInfo(req));
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:profileId/history", (req, res) => {
  try {
    res.status(200).json(profileController.getProfileHistory(req));
  } catch (error) {
    res.status(500).json(error);
  }
});



export default router;
