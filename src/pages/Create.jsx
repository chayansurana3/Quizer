import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Create(props) {
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctOption: "" }]);
    const userName = props.userName;
    const navigate = useNavigate();

    useEffect(() =>{
        if (!props.loggedIn) navigate("/login");
    }, [props.loggedIn, navigate])

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], correctOption: "" }]);
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleCorrectOptionChange = (questionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correctOption = value;
        setQuestions(updatedQuestions);
    };

    const handleDeleteQuestion = (index) => {
        if (index === 0) return;
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (questions.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You must add at least one question to create a quiz.'
            });
            return;
        }
        const title = document.getElementById('quizName').value;
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalTimeInSeconds < 120) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Total time should be at least 2 minutes.'
            });
            return;
        }
        if (totalTimeInSeconds > 36000) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Total time cannot exceed 10 hours.'
            });
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let size = 0;
                try {
                  const response = await fetch("/.netlify/functions/fetchQuiz");
                  const data = await response.json();
                  console.log(data);
                  size = data.length;
                } catch (error) {
                  console.error("Error fetching quiz data:", error);
                }
                console.log(totalTimeInSeconds);
                const response = await fetch("/.netlify/functions/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        id: size + 1, 
                        title: title,
                        questions, 
                        userName, 
                        totalTimeInSeconds,
                    })                
                });
                if (response.ok) {
                    console.log(questions);
                    navigate("/");
                    Swal.fire({
                        title: "Created!",
                        text: "Your quiz has been created.",
                        icon: "success"
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error while creating quiz. Please Try Again!'
                    });
                    return;
                }
            }
        })
    };

    return (
        <div className="mt-8 flex justify-center">
            <form className="text-center bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <h1 className="text-blue-500 text-5xl font-bold mb-8">Create a Quiz</h1>
                <div className="mb-4">
                    <label htmlFor="quizName" className="block text-gray-700 text-lg font-bold mb-2">Name of the quiz</label>
                    <input id="quizName" name="quizName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Name" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="totalTime" className="block text-gray-700 text-lg font-bold mb-2">Total Time</label>
                    <div className="flex">
                        <input id="hours" className="shadow appearance-none border rounded w-1/3 mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Hours" />
                        <input id="minutes" className="shadow appearance-none border rounded w-1/3 mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Minutes" />
                        <input id="seconds" className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Seconds" />
                    </div>
                </div>
                {questions.map((question, index) => (
                    <div key={index} className="mb-4">
                        <label htmlFor={`question-${index + 1}`} className="inline text-gray-700 text-lg font-bold mb-2">Question {index + 1}</label>
                        <div>
                            {index !== 0 && (
                                <button type="button" onClick={() => handleDeleteQuestion(index)} className="mb-2 mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" ><span><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" enable-background="new 0 0 60 60" viewBox="0 0 60 60" id="delete"><path d="M18.3,56h23.6c2.7,0,4.8-2.2,4.8-4.8V18.7h2.1c0.6,0,1-0.4,1-1v-2.3c0-2.1-1.7-3.7-3.7-3.7h-8.5V9.1c0-1.7-1.4-3.1-3.1-3.1 h-8.9c-1.7,0-3.1,1.4-3.1,3.1v2.6H14c-2.1,0-3.7,1.7-3.7,3.7v2.3c0,0.6,0.4,1,1,1h2.1v32.5C13.4,53.8,15.6,56,18.3,56z M44.7,51.2 c0,1.6-1.3,2.8-2.8,2.8H18.3c-1.6,0-2.8-1.3-2.8-2.8V18.7h29.3V51.2z M24.5,9.1C24.5,8.5,25,8,25.6,8h8.9c0.6,0,1.1,0.5,1.1,1.1v2.6 h-11V9.1z M12.3,15.4c0-1,0.8-1.7,1.7-1.7h32c1,0,1.7,0.8,1.7,1.7v1.3H12.3V15.4z"></path><path d="M37.9 49.2c.6 0 1-.4 1-1V24.4c0-.6-.4-1-1-1s-1 .4-1 1v23.8C36.9 48.8 37.4 49.2 37.9 49.2zM30.1 49.2c.6 0 1-.4 1-1V24.4c0-.6-.4-1-1-1s-1 .4-1 1v23.8C29.1 48.8 29.5 49.2 30.1 49.2zM22.2 49.2c.6 0 1-.4 1-1V24.4c0-.6-.4-1-1-1s-1 .4-1 1v23.8C21.2 48.8 21.6 49.2 22.2 49.2z"></path></svg></span></button>
                            )}
                        </div>
                        <input id={`question-${index + 1}`} name={`question-${index + 1}`} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder={`Question ${index + 1}`} value={question.question} onChange={(e) => handleQuestionChange(index, e.target.value)} required />
                        <div className="mt-2">
                            {question.options.map((option, optionIndex) => (
                                <input key={optionIndex} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2" type="text" placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)} required />
                            ))}
                        </div>
                        <div className="mt-2">
                            <label htmlFor={`correctOption-${index + 1}`} className="block text-gray-700 text-lg font-bold mb-2">Correct Option</label>
                            <input id={`correctOption-${index + 1}`} min="1" max="4" type="number" name={`correctOption-${index + 1}`} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder={`Correct Option for Question ${index + 1}`} value={question.correctOption} onChange={(e) => handleCorrectOptionChange(index, e.target.value)} required />
                        </div>
                    </div>
                ))}
                <div className="mb-4">
                    <button type="button" onClick={handleAddQuestion} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >Add a New Question</button>
                </div>
                <div className="flex justify-center">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Create Quiz</button>
                </div>
            </form>
        </div>
    );
}