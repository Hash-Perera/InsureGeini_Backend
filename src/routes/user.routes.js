import express from "express";
import {
  createCustomer,
  createStaff,
  loginUser,
  GetAllCustomers,
  getAllStaff,
  deleteUser,
  getCustomerById,
} from "../services/user.service.js";
const router = express.Router();
import upload from "../middlewares/upload.js";

router.post(
  "/createCustomer",
  upload.fields([
    { name: "nicImage", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
  ]),
  createCustomer
);
router.post("/createStaff", createStaff);
router.post("/login", loginUser);
router.get("/getAllCustomers", GetAllCustomers);
router.get("/getAllStaff", getAllStaff);
router.delete("/deleteUser/:id", deleteUser);
router.get("/getCustomerById/:id", getCustomerById);

export default router;
