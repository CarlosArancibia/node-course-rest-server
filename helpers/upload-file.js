const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (files, allowedExtensions = ["jpg", "png", "jpeg", "gif"], folder = "") => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    // Validate extension
    const nameSplit = file.name.split(".");
    const extension = nameSplit[nameSplit.length - 1];

    if (!allowedExtensions.includes(extension)) {
      return reject(`Extension ${extension} is not valid. The allowed extensions are ${allowedExtensions}`);
    }

    const tempName = uuidv4() + "." + extension;

    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFile,
};
