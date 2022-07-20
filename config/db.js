const mongoose = require("mongoose");

// Connect to MongoDB
exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
