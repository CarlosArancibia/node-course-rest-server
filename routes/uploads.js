const Router = require("express");
const { check } = require("express-validator");
const { upload, updateFile, getFile, updateFileCloudinary } = require("../controllers/uploads");
const { validateAllowedCollections } = require("../helpers");
const { validateFields, validateFileToUpload } = require("../middlewares");

const route = Router();

route.get("/:collection/:id", getFile);

route.post("/", validateFileToUpload, upload);

route.put(
  "/:collection/:id",
  [
    validateFileToUpload,
    check("id", "The id is not valid").isMongoId(),
    check("collection").custom((c) => validateAllowedCollections(c, ["users", "products"])),
    validateFields,
  ],
  updateFileCloudinary
  // updateFile
);

module.exports = route;
