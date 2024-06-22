const mongoose = require("mongoose");
const User = require("./models/userSchema");

exports.handler = async (event, context) => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
    const { id, title, email, score } = JSON.parse(event.body);
    console.log(id, title, email, score);
    const user = await User.findOne({ email });
    if (!user) return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" })
    };

    let existingQuizAttemptIndex = user.solvedQuizzes.findIndex((attempt) => attempt.id === id);

    if (existingQuizAttemptIndex !== -1) {
      user.solvedQuizzes[existingQuizAttemptIndex].score = score;
      user.solvedQuizzes[existingQuizAttemptIndex].title = title;
    } else {
      user.solvedQuizzes.push({ id, title, score });
    }

    await user.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Score updated successfully" })
    };
  } catch (error) {
    console.error("Error updating score:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};
