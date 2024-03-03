import React, { useState, useEffect, useCallback } from "react";
import Question from "./Question";
import Swal from "sweetalert2";

export default function Quiz({ name, problems, timeLimit, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(problems.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setTimerRunning(true);
  }, []);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timerRunning, timeLeft]);

  const finishTest = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setTimerRunning(false);
        onClose({ answers, timeLeft});
      }
    });
  }, [onClose, answers, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerRunning(false);
      onClose({ answers, timeLeft});
      Swal.fire({
        title: "Time's Up!",
        text: "Your responses have been submitted.",
        icon: "success"
      });
    }
  }, [timeLeft, finishTest, onClose, answers]);

  const handleAnswerChange = (selectedOption) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = selectedOption;
    setAnswers(updatedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < problems.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white py-4 px-6 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{name}</h2>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow" onClick={finishTest}>Finish Test</button>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto">
        <p className="text-xl float-right">Question {currentQuestion + 1} of {problems.length}</p>
        <div className="bg-white shadow-md mt-4 text-black rounded-md p-6 mb-4">
          <h3 className="text-xl font-semibold mb-4">
            Time Left: {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
          </h3>
          <Question question={problems[currentQuestion].question} options={problems[currentQuestion].options} questionNumber={currentQuestion + 1} selectedOption={answers[currentQuestion]} onAnswerChange={handleAnswerChange} />
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow" onClick={goToPreviousQuestion}>Previous</button>
          {currentQuestion < problems.length - 1 && (
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow" onClick={goToNextQuestion}>Next</button>
          )}
          {currentQuestion === problems.length - 1 && (
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow" onClick={finishTest}>Submit</button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
