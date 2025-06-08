import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", async (req, res) => {
  const response = await register(req);
  response.success
    ? res.status(201).json(response)
    : res.status(response.data.code).json(response);
});

router.post("/login", async (req, res, next) => {

  const response = await login(req,res,next);
  response.success
    ? res.status(200).json(response)
    : res.status(response.data.code).json(response);
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: "Logout effettuato con successo" });
  });
});

export default router;
