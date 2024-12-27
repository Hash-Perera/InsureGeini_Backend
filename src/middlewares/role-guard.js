//! This middleware is used to check if the user has the required permission to access the route and do the action.
const User = require("../models/user.model");
const Role = require("../models/role.model");
const RoleGuard = (permissionNo) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user);
    //? get user permissions
    const permissions = await Role.findById(user.role).populate("permissions");
    const userPermissionsList = permissions.permissions.map((permission) => {
      return permission.permissionNo;
    });

    if (
      userPermissionsList === undefined ||
      userPermissionsList === null ||
      userPermissionsList === "" ||
      userPermissionsList.length === 0
    ) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Check if the user has the required permission
    const hasPermission = userPermissionsList.includes(permissionNo);
    if (!hasPermission) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // If the user has the required permission, continue to the next
    next();
  };
};

module.exports = RoleGuard;
