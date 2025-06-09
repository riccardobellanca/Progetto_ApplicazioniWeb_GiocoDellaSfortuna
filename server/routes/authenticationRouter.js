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
  if (req.user !== undefined)
    console.log("previous UserSession => " + JSON.stringify(req.user, null, 2));

  const response = await login(req, res, next);
  response.success
    ? res.status(200).json(response)
    : res.status(response.data.code).json(response);
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          data: { message: "Errore durante il logout", code: 500 },
        });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({
            success: false,
            data: {
              message: "Errore nella distruzione della sessione",
              code: 500,
            },
          });
      }
      res.status(200).json({
        success: true,
        data: { message: "Logout effettuato con successo" },
      });
    });
  });
});

export default router;
