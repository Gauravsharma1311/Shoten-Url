// middlewares/permissionMiddleware.js
const userService = require("../services/userService");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const permissions = await userService.getUserPermissions(userId);

      const hasPermission = permissions.some((permission) =>
        permission.actions.some((action) => action.name === requiredPermission)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden", status: 403 });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Internal Server Error",
          error: error.message,
          status: 500,
        });
    }
  };
};

module.exports = { checkPermission };
