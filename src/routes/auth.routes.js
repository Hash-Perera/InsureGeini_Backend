const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service.js");

router.post("/register", authService.register);
router.post("/login", authService.login);
router.post("/role", authService.createRole);

module.exports = router;
