const mongoose = require("mongoose");

async function connect_DB() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    if (!connect) {
      return console.log("You have a problem to connect to the mongodb");
    } else {
      console.log("Connected😊");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect_DB;
