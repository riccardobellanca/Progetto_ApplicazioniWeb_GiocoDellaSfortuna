import { Router } from "express";
import { param } from "express-validator";
import { requireAuth, requireOwnership, checkValidation } from "../controllers/authController.js";
import {
  getProfileInfo,
  getProfileHistory,
} from "../controllers/profileController.js";

const router = Router();

const validateProfileId = [
  param("profileId")
    .isInt({ min: 1 })
    .withMessage("Profile ID deve essere un numero intero valido.")
];

router.get("/:profileId", 
  validateProfileId,
  checkValidation,
  requireAuth, 
  requireOwnership, 
  async (req, res) => {
    try {
      const result = await getProfileInfo(req.params.profileId);
      const statusCode = result.success ? 200 : (result.data?.code || 400);
      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        data: { message: "Errore interno del server", code: 500 }
      });
    }
  }
);

router.get("/:profileId/history", 
  validateProfileId,
  checkValidation,
  requireAuth, 
  requireOwnership, 
  async (req, res) => {
    try {
      const response = await getProfileHistory(req.params.profileId);
      const statusCode = response.success ? 200 : (response.data?.code || 400);
      res.status(statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        data: { message: "Errore interno del server", code: 500 }
      });
    }
  }
);

export default router;