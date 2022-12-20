const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Database online");
  } catch (error) {
    console.log(error);
    throw new Error(`Error to start the Database`);
  }
};

module.exports = {
  dbConnection,
};
