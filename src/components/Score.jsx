import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Legend, Title, Tooltip } from 'chart.js';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Legend, Title, Tooltip);

export default function Score({ quizName, userScore, totalQuestions, totalTimeTaken, totalTime }){
    const navigate = useNavigate();
    const scoreData = {
        labels: ['Correct Answers', 'Incorrect Answers'],
        datasets: [
            {
                label: 'Score',
                data: [userScore, totalQuestions - userScore],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const timeData = {
        labels: ['Time Taken', 'Remaining Time'],
        datasets: [
            {
                label: 'Time',
                data: [totalTimeTaken, totalTime - totalTimeTaken],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    const goToHome = () => navigate("/");

    return (
        <div className="text-center score-container border border-gray-300 p-4 rounded-lg shadow-md">
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 via-green-500 to-blue-500 bg-clip-text animate-pulse mb-2">Congratulations!</h1>
            <h2 className='text-3xl font-bold text-blue-600'>Your Score Card</h2>
            <h3 className="text-2xl font-semibold mb-4 mt-2 text-blue-500">{quizName}</h3>
            <p className="text-xl">Score: <span className="text-green-700 font-semibold">{userScore} out of {totalQuestions} correct attempts!</span></p>
            <p className="text-xl">Total Time Taken: <span className="text-green-700 font-semibold">{totalTimeTaken} seconds</span></p>
            <div className="mt-4 rounded-sm">
                <Doughnut data={scoreData} options={options} />
            </div>
            <div className="mt-4 rounded-md">
                <Doughnut data={timeData} options={options} />
            </div>
            <button className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300" onClick={goToHome}>Take Me Home</button>

        </div>
    );
};