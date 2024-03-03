const mongoose = require("mongoose");
const Quiz = require("./models/quizSchema");

exports.handler = async (event, context) => {
  try {

    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.y0mzlcb.mongodb.net/${process.env.QUIZ_DB}?retryWrites=true&w=majority`)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => console.error("Error connecting to MongoDB:", error));

    const quizzes = await Quiz.find();

    return {
      statusCode: 200,
      body: JSON.stringify(quizzes)
    };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};

