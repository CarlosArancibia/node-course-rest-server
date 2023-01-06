const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      users: "/api/users",
      categories: "/api/categories",
      auth: "/api/auth",
      products: "/api/products",
      search: "/api/search",
    };

    //Connect to Database
    this.connectDB();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Receive and parse Post Data
    this.app.use(express.json());

    //Public directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/searches"));
  }

  listen() {
    this.app.listen(this.port, () => console.log("page run in port: ", this.port));
  }
}

module.exports = Server;
