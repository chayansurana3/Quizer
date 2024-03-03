const mongoose = require("mongoose");
const User = require("./models/userSchema");

exports.handler = async (event, context) => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
    const { email } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user) return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" })
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ user, message: "User Data fetched successfully" })
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};
