// netlify-functions/verify.js
const mongoose = require("mongoose");
const User = require("./models/userSchema");

exports.handler = async (event, context) => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
    
    const token = event.headers.authorization;
    if (!token) return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'Unauthorized' })
    };

    const user = await User.findOne({ 'authToken.token': token });
    if (!user || user.authToken.expiresAt < new Date()) return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'Token expired or invalid' })
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Access granted',
        userName: user.userName,
        userEmail: user.email
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal server error' })
    };
  }
};