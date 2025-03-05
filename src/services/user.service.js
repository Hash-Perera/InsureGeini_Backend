import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import Role from "../models/role.model.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

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

export const createUser = async (req, res) => {
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
      let user;

      if (reqRole.name === "staff") {
        const { name, email, mobileNumber, address, role } = req.body;

        // Validate staff fields
        const validationError = validateFields(
          [name, email, mobileNumber, address, role],
          res
        );
        if (validationError) return validationError;

        user = new User({
          name,
          email,
          password: encryptedPassword,
          mobileNumber,
          address,
          role,
        });
      }

      if (reqRole.name === "Customer") {
        const {
          name,
          insuranceId,
          email,
          mobileNumber,
          address,
          role,
          dob,
          NIC_No,
          NIC_image,
          drivingLicenseNo,
          drivingLicenseImage,
        } = req.body;

        // Validate customer fields
        const validationError = validateFields(
          [
            name,
            email,
            mobileNumber,
            address,
            role,
            dob,
            NIC_No,
            NIC_image,
            drivingLicenseNo,
            drivingLicenseImage,
          ],
          res
        );
        if (validationError) return validationError;

        user = new User({
          name,
          insuranceId,
          email,
          password: encryptedPassword,
          mobileNumber,
          address,
          role,
          dob,
          NIC_No,
          NIC_image,
          drivingLicenseNo,
          drivingLicenseImage,
        });
      }

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
