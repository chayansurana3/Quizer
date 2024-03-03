const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userSchema");

exports.handler = async (event, context) => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
    
    const { newPassword, email } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user) return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" })
    };

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    
    if (isSamePassword) return {
      statusCode: 409,
      body: JSON.stringify({ message: "New password must be different from the old password" })
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password changed successfully" })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};