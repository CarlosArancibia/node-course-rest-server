const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require("../helpers");
const path = require("path");
const fs = require("fs");
const { User, Product } = require("../models");
const { URL } = require("url");

const upload = async (req, res = response) => {
  try {
    // const name = await uploadFile(req.files, ["pdf", "md"], "docs");
    const name = await uploadFile(req.files, undefined, "imgs");
    res.json({ name });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const updateFile = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The user with id: ${id} does not exist`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The product with id: ${id} does not exist`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Forgot to validate this" });
  }

  // Borrar imagenes anteriores de un usuario, para evitar tener imágenes innecesarias (Objetivo: Eficiencia)
  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  try {
    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;

    await model.save();

    res.json({ model });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const updateFileCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The user with id: ${id} does not exist`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `The product with id: ${id} does not exist`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Forgot to validate this" });
  }

  // Borrar imagenes anteriores de un usuario, para evitar tener imágenes innecesarias (Objetivo: Eficiencia)
  if (model.img) {
    const urlImgSplit = model.img.split("/");
    const nameImg = urlImgSplit[urlImgSplit.length - 1];
    const [publicId] = nameImg.split(".");
    cloudinary.uploader.destroy(publicId);
  }

  try {
    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;
    await model.save();

    res.json({ model });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const getFile = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        res.status(400).json({ msg: `The user with id: ${id} does not exist` });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `The product with id: ${id} does not exist` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Forgot to validate this" });
  }

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }
  const pathImgDefault = path.join(__dirname, "../assets/noimage.jpg");
  res.sendFile(pathImgDefault);
};

module.exports = {
  upload,
  updateFile,
  getFile,
  updateFileCloudinary,
};
