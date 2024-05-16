import React from "react";
import { Link } from "react-router-dom";
import bg1 from "../images/bg1.avif";

export default function Home() {
    return (
        <div className="h-screen text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bg1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-12">Welcome to Quizer</h1>
                <p className="text-lg mb-12">The ultimate platform for creating, sharing, and taking a quiz.</p>
                <div className="flex items-center justify-center">
                    <Link to="/create" className="bg-green-500 hover:bg-green-700 text-white font-extrabold py-4 px-8 rounded-lg shadow-md mr-4">Create a Quiz</Link>
                    <Link to="/explore" className="bg-yellow-500 hover:bg-yellow-700 text-white font-extrabold py-4 px-8 rounded-lg shadow-md">Explore Quizzes</Link>
                </div>
            </div>
        </div>
    )
}