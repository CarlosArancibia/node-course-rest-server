const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  // Validate user is in the request
  if (!req.userAuth) {
    return res.status(500).json({
      msg: "Try to validate the role without verifying the token first",
    });
  }

  const { role, name } = req.userAuth;

  // Validate user role
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not administrator: Can't perform this action`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    // Validate user is in the request
    if (!req.userAuth) {
      return res.status(500).json({
        msg: "Try to validate the role without verifying the token first",
      });
    }

    if (!roles.includes(req.userAuth.role)) {
      return res.status(401).json({
        msg: `This action requires one of the roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = { isAdminRole, hasRole };
