import jwt from "jsonwebtoken";
import argon2 from "argon2";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";

//!---- Register User Service
const register = async (req, res) => {
  try {
    const userData = req.body;
    const encryptedPassword = await argon2.hash(userData.password);
    userData.password = encryptedPassword;
    userData.insuranceId = userData.insuranceId.toLowerCase();

    const newUser = await User.create(userData);
    res.status(200).json({ success: true, data: newUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create user. Please try again.",
    });
  }
};

//!---- Login User Service
const login = async (req, res) => {
  try {
    const dto = req.body;
    const user = await User.findOne({
      insuranceId: dto.insuranceId.toLowerCase(),
    });
    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found. Please try again." });
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
        expiresIn: "30d",
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

//!---- Create Role Service
const createRole = async (req, res) => {
  try {
    const role = req.body;
    const newRole = await Role.create(role);
    res.status(200).json({ success: true, data: newRole });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create role. Please try again.",
    });
  }
};

// Add this at the bottom of the file
export default {
  register,
  login,
  createRole,
};
