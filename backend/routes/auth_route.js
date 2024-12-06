import express from "express";
import { authenticate, authorize } from "../controller/auth_controller.js";

const router = express.Router();

// Route untuk login
router.post("/login", authenticate);

// Route untuk otorisasi
router.get("/protected", authorize, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Anda memiliki akses ke route ini!",
    user: req.user,
  });
});

export default router;
