const dbValidator = require("./db-validators");
const generateJWT = require("./generate-jwt");
const googleVerify = require("./google-verify");
const uploadFile = require("./upload-file");

module.exports = {
  ...dbValidator,
  ...generateJWT,
  ...googleVerify,
  ...uploadFile,
};
