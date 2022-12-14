const { Router } = require("express");
const { getUsers, postUsers, putUsers, patchUsers, deleteUsers } = require("../controllers/users");

const route = Router();

route.get("/", getUsers);

route.post("/", postUsers);

route.put("/:id", putUsers);

route.patch("/", patchUsers);

route.delete("/:id", deleteUsers);

module.exports = route;
