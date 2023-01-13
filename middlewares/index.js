const validateFields = require("../middlewares/validate-fields");
const validateJWT = require("../middlewares/validate-jwt");
const ValidateRoles = require("../middlewares/validate-roles");
const validateFileToUpload = require("../middlewares/validate-file");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...ValidateRoles,
  ...validateFileToUpload,
};
