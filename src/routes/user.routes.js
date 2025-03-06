import express from "express";
import {
  createCustomer,
  createStaff,
  loginUser,
} from "../services/user.service.js";
const router = express.Router();
import upload from "../middlewares/upload.js";

router.post(
  "/createCustomer",
  upload.fields([
    { name: "NIC_image", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
  ]),
  createCustomer
);
router.post("/createStaff", createStaff);
router.post("/login", loginUser);

export default router;
