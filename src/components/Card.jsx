import React from 'react';

export default function Card({ image, title, author, totalTime, onStartQuiz }) {
  return (
    <div className="bg-white shadow-xl rounded-md p-3 max-w-sm mx-auto text-center">
      <div className="mb-4">
        <img src={image} alt="Quiz" className="rounded-lg mb-2 w-full h-60 object-cover" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 text-lg mb-2 font-semibold">Author: {author}</p>
        <p className="text-gray-600 text-lg mb-4 font-semibold">Total Time: {totalTime} seconds</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200" onClick={onStartQuiz}>Attempt Quiz</button>
      </div>
    </div>
  );
};