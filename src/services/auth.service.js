const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const Role = require("../models/role.model");
const User = require("../models/user.model");

//!---- Register User Service
exports.register = async (req, res) => {
  try {
    const userData = req.body;
    const encryptedPassword = await argon2.hash(userData.password);
    userData.password = encryptedPassword;
    userData.insuranceId = userData.insuranceId.toLowerCase();

    const newUser = await User.create(userData);
    res.status(200);
    res.json({ success: true, data: newUser });
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to create user. Please try again.");
  }
};

//!---- Login User Service
exports.login = async (req, res) => {
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

    //? generate jwt token
    const payload = jwt.sign(
      { id: user._id, role: role.name },
      process.env.JWT_SECRET || "InsureGeiniJWTKey123456",
      {
        expiresIn: "30d",
      }
    );

    //? send token and permissions
    res.status(200).json({ token: payload, role: role.name });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

exports.createRole = async (req, res) => {
  try {
    const role = req.body;
    const newRole = await Role.create(role);
    res.status(200);
    res.json({ success: true, data: newRole });
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to create role. Please try again.");
  }
};
