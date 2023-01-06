const { Router } = require("express");
const { search } = require("../controllers/searches");
const route = Router();

route.get("/:collection/:term", search);

module.exports = route;
