const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

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
      uploads: "/api/uploads",
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

    // File upload
    this.app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/", createParentPath: true }));
  }

  routes() {
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/searches"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => console.log("page run in port: ", this.port));
  }
}

module.exports = Server;
