import mongoose from "mongoose";
import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import Role from "../models/role.model.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import awsService from "../services/aws.service.js";

// Helper function to validate required fields
const validateFields = (fields, res) => {
  for (const field of fields) {
    if (!field) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
  }
  return null; // No validation errors
};

export const createStaff = async (req, res) => {
  try {
    const role = req.role;
    // Ensure only "admin" can create users
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const requestedUserCreateRole = req.body.role;
    const reqRole = await Role.findById(requestedUserCreateRole);

    // Handle unknown role
    if (!reqRole) {
      return res.status(400).json({
        success: false,
        message: "Unknown role.",
      });
    }

    const encryptedPassword = await argon2.hash(req.body.password);

    // Create user based on role
    try {
      if (reqRole.name !== "staff") {
        return res.status(400).json({
          success: false,
          message: "Unknown role requested.",
        });
      }
      const { name, email, password, mobileNumber, address, role } = req.body;

      // Validate staff fields
      const validationError = validateFields(
        [name, email, password, mobileNumber, address, role],
        res
      );
      if (validationError) return validationError;

      const user = new User({
        name,
        email,
        password: encryptedPassword,
        mobileNumber,
        address,
        role,
      });

      // Save user
      await user.save();
      return res.status(201).json({
        success: true,
        message: `${reqRole.name} created successfully.`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "An error occurred while creating the user.",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const accessRole = req.role;
    const fileData = req.files;

    // Ensure only "admin" can create users
    if (accessRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const requestedUserCreateRole = req.body.role;
    const reqRole = await Role.findById(requestedUserCreateRole);

    if (reqRole.name !== "Customer") {
      return res.status(400).json({
        success: false,
        message: "Unknown role requested.",
      });
    }

    const {
      name,
      insuranceId,
      email,
      mobileNumber,
      password,
      address,
      role,
      dob,
      NIC_No,
      drivingLicenseNo,
    } = req.body;

    const encryptedPassword = await argon2.hash(req.body.password);

    const validationError = validateFields(
      [
        name,
        email,
        mobileNumber,
        password,
        address,
        role,
        dob,
        NIC_No,
        drivingLicenseNo,
      ],
      res
    );
    if (validationError) return validationError;

    const userId = new mongoose.Types.ObjectId(); // Manually generate ObjectId

    const folderPath = `${userId}`;

    const NIC_image = await awsService.uploadSingleFile(
      fileData.NIC_image[0],
      folderPath
    );
    const drivingLicenseImage = await awsService.uploadSingleFile(
      fileData.drivingLicenseImage[0],
      folderPath
    );

    const user = new User({
      _id: userId,
      name,
      insuranceId,
      email,
      password: encryptedPassword,
      mobileNumber,
      address,
      role,
      dob,
      NIC_No,
      drivingLicenseNo,
      NIC_image: NIC_image,
      drivingLicenseImage: drivingLicenseImage,
    });

    // Save user
    await user.save();
    return res.status(201).json({
      success: true,
      message: "Customer created successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const dto = req.body;
    let user;

    user = await User.findOne({
      email: dto.email,
    });

    if (!user) {
      user = await User.findOne({
        insuranceId: dto.insuranceId.toLowerCase(),
      });

      if (!user) {
        return res
          .status(403)
          .json({ message: "User not found. Please try again." });
      }
    }

    if (!(await argon2.verify(user.password, dto.password))) {
      return res
        .status(403)
        .json({ message: "Password is incorrect. Please try again." });
    }

    const role = await Role.findById(user.role);

    if (!role) {
      return res
        .status(403)
        .json({ message: "Role not found. Please try again." });
    }

    //? Generate JWT token
    const payload = jwt.sign(
      { id: user._id, role: role.name },
      process.env.JWT_SECRET || "InsureGeiniJWTKey123456",
      {
        expiresIn: "2h",
      }
    );
    //? Send token and permissions
    res.status(200).json({ token: payload, role: role.name });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Login failed. Please try again." });
  }
};
