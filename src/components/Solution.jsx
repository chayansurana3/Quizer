import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Solution({ quiz, userAnswers }) {
    const navigate = useNavigate();
    const goToHome = () => navigate("/");

    useEffect(() => console.log("Loaded: ", quiz));

    return (
        <div className="max-w-3xl mx-auto">
            {quiz.questions.map((question, index) => (
                <div key={index} className="bg-white shadow-md mt-4 text-black rounded-md p-6 mb-4">
                    <h3 className="text-xl font-semibold mb-4">Question {index + 1}</h3>
                    <h4 className="text-lg mb-4">{question.question}</h4>
                    <div className="grid grid-cols-1 gap-4">
                        {question.options.map((option, optionIndex) => (
                            <button
                                key={optionIndex}
                                className={`block w-full py-2 px-4 rounded ${userAnswers[index] === optionIndex + 1 && quiz.questions[index].correctOption !== optionIndex + 1
                                        ? "bg-red-500 text-white" 
                                        : quiz.questions[index].correctOption === optionIndex + 1
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-400 text-black"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {index >= quiz.questions.size - 1 && <div className="mt-4"><button onClick={goToHome} className="mx-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow">Take me home</button></div> }
                </div>
            ))}
        </div>
    );
};