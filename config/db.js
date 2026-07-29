const mongoose = require("mongoose");

async function connectToDB() {

  // Connection To Database
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To MongoDB...")
  } catch (error) {
    console.log("Connection Failed To MongoDB!");
  }
}

module.exports = connectToDB;

/* old syntax
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected To MongoDB..."))
  .catch((error) => console.log("Connection Failed To MongoDB!"));
*/