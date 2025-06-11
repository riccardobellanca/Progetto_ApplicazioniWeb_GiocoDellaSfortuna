import { Router } from "express";
import { requireAuth, requireOwnership } from "../controllers/authController.js";
import {
  getProfileInfo,
  getProfileHistory,
} from "../controllers/profileController.js";

const router = Router();

router.get("/:profileId", requireAuth, requireOwnership, async (req, res) => {
  const result = await getProfileInfo(req.params.profileId);
  res.status(result.success ? 200 : result.data.code).json(result);
});

router.get("/:profileId/history", requireAuth, requireOwnership, async (req, res) => {
  const response = await getProfileHistory(req.params.profileId);
  response.success
    ? res.status(200).json(response)
    : res.status(response.data.code).json(response);
});

export default router;
