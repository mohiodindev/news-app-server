const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(
      // process.env.MONGODB_URL ||
      "mongodb://localhost:27017/news-app-dev"
    );
    console.log(`MongoDB is connected: ${connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDatabase,
};
