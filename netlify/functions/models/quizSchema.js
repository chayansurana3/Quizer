const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: String,
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true }
    }],
    author: { type: String, required: true },
    time: { type: Number, required: true },
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;