import { Router } from "express";
import { isLoggedIn } from "../auth/auth-middleware.js";
import {
  getProfileInfo,
  getProfileHistory,
} from "../controllers/profileController.js";

const router = Router();

router.get("/:profileId", async (req, res) => {
  const result = await getProfileInfo(req);
  res.status(result.success ? 200 : result.data.code).json(result);
});

router.get("/:profileId/history", async (req, res) => {
  const response = await getProfileHistory(req);
  response.success
    ? res.status(200).json(response)
    : res.status(response.data.code).json(response);
});

export default router;
