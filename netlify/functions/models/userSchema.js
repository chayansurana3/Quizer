const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  solvedQuizzes: [ { id: Number, title: String, score: Number } ],
  authToken: {
    token: { type: String },
    expiresAt: { type: Date }
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
