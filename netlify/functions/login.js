const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");

exports.handler = async (event, context) => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user) return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid email or password" })
    };

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid email or password" })
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
    user.authToken = { token, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) };

    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ user, token, message: "Login successful" })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};