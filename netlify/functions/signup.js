const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userSchema");

exports.handler = async (event, context) => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
    
    const { userName, email, password } = JSON.parse(event.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return {
      statusCode: 400,
      body: JSON.stringify({ message: "User already exists" })
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully" })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};
