import React from "react";

export default function Question(props) {

  const problem = props.question;
  const options = props.options; 
  const id = props.questionNumber;
  var selectedOption = props.selectedOption;
  
  const handleAnswerSelection = (option) => props.onAnswerChange(option);

  return (
    <div className="bg-white shadow-md text-black rounded-md p-6">
      <h1 className="text-2xl font-bold mb-4">Question {id}</h1>
      <h2 className="text-lg mb-4">{problem}</h2>
      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <button key={index} className={`block w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline ${selectedOption === index + 1 ? 'bg-blue-700 text-white' : 'bg-blue-400 hover:bg-blue-700 text-white'}`} onClick={() => handleAnswerSelection(index + 1)}>{option}</button>
        ))}
      </div>
    </div>
  );
}