import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

export default function AuthGuard(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  //! Allow login endpoint without token
  if (req.path === "/v1/auth/login") {
    return next();
  }
  if (req.path === "/v1/auth/register") {
    return next();
  }
  if (req.path === "/v1/user/login") {
    return next();
  }
  if (req.path === "/v1/user") {
    return next();
  }

  //! Checking token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "InsureGeiniJWTKey123456",
    async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token! didn't match" });
      }

      const findUser = await User.findById(user.id).select("-password");
      const findRole = await Role.findById(findUser.role);

      if (!findRole) {
        return res
          .status(403)
          .json({ message: "Invalid token! cannot find role" });
      }

      if (!findUser) {
        return res
          .status(403)
          .json({ message: "Invalid token! cannot find user" });
      }

      req.role = findRole.name;
      req.user = findUser._id;
      next();
    }
  );
}
