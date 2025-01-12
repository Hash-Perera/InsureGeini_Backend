import express from "express";
import authService from "../services/auth.service.js";

const router = express.Router();

router.post("/register", authService.register);
router.post("/login", authService.login);
router.post("/role", authService.createRole);

export default router;
