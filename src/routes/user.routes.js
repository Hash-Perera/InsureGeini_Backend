import express from "express";
import { createUser, loginUser } from "../services/user.service.js";
const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);

export default router;
