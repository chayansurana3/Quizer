import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NavBar(props) {
    const [quizzes, setQuizzes] = useState([]);
    const [showMenu, setMenuDropdown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        setQuizzes(props.quizzes)
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuDropdown(false);
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [dropdownRef, props.quizzes, setQuizzes]);
    
    const handleMenuToggle = () => setMenuDropdown(!showMenu);


    useEffect(() => {
        const filtered = quizzes.filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredQuizzes(filtered);
        console.log(filtered);
    }, [searchQuery, quizzes]);

    const navigateToQuiz = (quizId) => {
        navigate("/explore");
        setShowDropdown(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowDropdown(e.target.value.trim() !== "");
    };

    const renderDropdown = () => {
        if (!showDropdown || filteredQuizzes.length === 0) return null;
        return (
            <div ref={dropdownRef} className="absolute left-88 mt-12 w-72 bg-white rounded-md shadow-lg py-1">
                {filteredQuizzes.map((quiz) => (
                    <button key={quiz.id} onClick={() => navigateToQuiz(quiz.id)} className="block px-4 py-2 w-full text-gray-800 hover:bg-gray-200">{quiz.title}</button>
                ))}
            </div>
        );
    };

    return !props.display ? null : (
        <nav className="top-0 shadow-xl p-2 w-full lg:flex flex-row justify-between items-center">
            <NavLink className="lg:inline text-5xl mt-2 lg:ml-0 ml-24 px-6 mb-4 font-bold text-purple-600 hover:text-purple-800 transition duration-300" to='/'>Quizer</NavLink>
            <div className="lg:inline-flex mr-12 hidden">
                <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="lg:inline bg-white border-2 border-gray-300 rounded-full py-2 px-4 focus:outline-none w-72 focus:border-blue-500"
                />
                {renderDropdown()}
            </div>
            {!props.loggedIn ?
                <div className="lg:inline block ml-2 lg:ml-0 lg:mt-4 mb-4 mt-8">
                    <NavLink to="/login" className="ml-4 mt-4 lg:mt-0 lg:ml-0 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-4">LOGIN</NavLink>
                    <NavLink to="/signup" className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2">SIGN UP</NavLink>
                    <NavLink to="/create" className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">CREATE A QUIZ</NavLink>
                </div>
                :
                <div className="ml-24 lg:inline mt-6 mb-4">
                    <button ref={menuRef} onClick={handleMenuToggle} className="flex items-center space-x-2 text-white bg-blue-100 hover:bg-gray-300 px-3 py-2 rounded-md focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1024 1024" id="user"><path d="M670.1 278.4c0 8.8-.6 17.6-1.7 26.3.5-3.5 1-7.1 1.4-10.6-2.4 17.4-7 34.3-13.7 50.5 1.3-3.2 2.7-6.4 4-9.6-6.7 15.8-15.3 30.6-25.8 44.2l6.3-8.1c-10.4 13.4-22.5 25.5-35.9 35.9l8.1-6.3c-13.6 10.4-28.4 19.1-44.2 25.8 3.2-1.3 6.4-2.7 9.6-4-16.2 6.7-33.1 11.3-50.5 13.7 3.5-.5 7.1-1 10.6-1.4-17.5 2.3-35.1 2.3-52.6 0 3.5.5 7.1 1 10.6 1.4-17.4-2.4-34.3-7-50.5-13.7 3.2 1.3 6.4 2.7 9.6 4-15.8-6.7-30.6-15.3-44.2-25.8l8.1 6.3c-13.4-10.4-25.5-22.5-35.9-35.9l6.3 8.1c-10.4-13.6-19.1-28.4-25.8-44.2 1.3 3.2 2.7 6.4 4 9.6-6.7-16.2-11.3-33.1-13.7-50.5.5 3.5 1 7.1 1.4 10.6-2.3-17.5-2.3-35.1 0-52.6-.5 3.5-1 7.1-1.4 10.6 2.4-17.4 7-34.3 13.7-50.5-1.3 3.2-2.7 6.4-4 9.6 6.7-15.8 15.3-30.6 25.8-44.2l-6.3 8.1c10.4-13.4 22.5-25.5 35.9-35.9l-8.1 6.3c13.6-10.4 28.4-19.1 44.2-25.8-3.2 1.3-6.4 2.7-9.6 4 16.2-6.7 33.1-11.3 50.5-13.7-3.5.5-7.1 1-10.6 1.4 17.5-2.3 35.1-2.3 52.6 0-3.5-.5-7.1-1-10.6-1.4 17.4 2.4 34.3 7 50.5 13.7-3.2-1.3-6.4-2.7-9.6-4 15.8 6.7 30.6 15.3 44.2 25.8l-8.1-6.3c13.4 10.4 25.5 22.5 35.9 35.9l-6.3-8.1c10.4 13.6 19.1 28.4 25.8 44.2-1.3-3.2-2.7-6.4-4-9.6 6.7 16.2 11.3 33.1 13.7 50.5-.5-3.5-1-7.1-1.4-10.6 1.1 8.7 1.6 17.5 1.7 26.3.1 20.9 18.3 41 40 40 21.6-1 40.1-17.6 40-40-.2-47.9-14.6-96.9-42.8-135.9-7.6-10.5-15.7-20.8-24.7-30.1-9.1-9.4-19.1-17.5-29.5-25.4-18.9-14.4-40-25-62.4-33.2-90.3-33.1-199.2-3.6-260.3 70.8-8.4 10.2-16.4 20.8-23.2 32.2-6.8 11.3-12.1 23.3-17 35.5-9.2 22.6-13.9 46.6-15.8 70.9-3.7 47.6 8.7 97.3 33.5 138.1 23.9 39.4 60 73.2 102.2 92.3 12.4 5.6 25.1 10.8 38.3 14.5 13.1 3.6 26.4 5.6 39.9 7.2 24.6 2.9 49.7.9 74-4 92.3-18.8 169.6-98.3 183.9-191.6 2.1-13.6 3.7-27.2 3.7-41 .1-20.9-18.5-41-40-40-21.6.7-39.8 17.3-39.8 39.7zm132.7 625.3H289.7c-22.7 0-45.4.2-68.1 0-2.5 0-5-.2-7.4-.5 3.5.5 7.1 1 10.6 1.4-4-.6-7.8-1.7-11.5-3.2 3.2 1.3 6.4 2.7 9.6 4-4-1.7-7.7-3.9-11.2-6.6l8.1 6.3c-3-2.5-5.8-5.2-8.2-8.2l6.3 8.1c-2.7-3.5-4.8-7.2-6.6-11.2 1.3 3.2 2.7 6.4 4 9.6-1.5-3.7-2.5-7.6-3.2-11.5.5 3.5 1 7.1 1.4 10.6-1.6-12.1-.5-24.9-.5-37.1v-42.8c0-10.7.6-21.3 2-31.9-.5 3.5-1 7.1-1.4 10.6 2.8-20.5 8.2-40.6 16.3-59.7-1.3 3.2-2.7 6.4-4 9.6 7.8-18.2 17.8-35.3 29.9-51l-6.3 8.1c12.1-15.5 26-29.5 41.6-41.6L283 673c15.7-12.1 32.8-22.1 51-29.9-3.2 1.3-6.4 2.7-9.6 4 19.1-8 39.1-13.5 59.7-16.3-3.5.5-7.1 1-10.6 1.4 14.8-1.9 29.5-2 44.4-2h183c16.5 0 32.9-.1 49.4 2-3.5-.5-7.1-1-10.6-1.4 20.5 2.8 40.6 8.2 59.7 16.3-3.2-1.3-6.4-2.7-9.6-4 18.2 7.8 35.3 17.8 51 29.9l-8.1-6.3c15.5 12.1 29.5 26 41.6 41.6l-6.3-8.1c12.1 15.7 22.1 32.8 29.9 51-1.3-3.2-2.7-6.4-4-9.6 8 19.1 13.5 39.1 16.3 59.7-.5-3.5-1-7.1-1.4-10.6 1.9 15.1 2 30.1 2 45.3v49.5c0 5.7.2 11.4-.5 17 .5-3.5 1-7.1 1.4-10.6-.6 4-1.7 7.8-3.2 11.5 1.3-3.2 2.7-6.4 4-9.6-1.7 4-3.9 7.7-6.6 11.2l6.3-8.1c-2.5 3-5.2 5.8-8.2 8.2l8.1-6.3c-3.5 2.7-7.2 4.8-11.2 6.6 3.2-1.3 6.4-2.7 9.6-4-3.7 1.5-7.6 2.5-11.5 3.2 3.5-.5 7.1-1 10.6-1.4-2.2.3-4.5.4-6.8.5-10.3.1-20.9 4.4-28.3 11.7-6.9 6.9-12.2 18.3-11.7 28.3 1 21.4 17.6 40.3 40 40 38.9-.6 73.1-26 84.5-63.3 4.5-14.8 3.5-30.7 3.5-45.9 0-34.8 1.1-69.3-4.9-103.8-8.8-50.5-34.2-98-69-135.3-34.8-37.3-81.6-64.7-131.1-76.9-28.4-7-57-8.1-86-8.1H422.4c-29.7 0-59.2 1.4-88.1 9.1-49.1 13-95.3 40.7-129.4 78.3-34.4 37.9-59.3 85.5-67.4 136.3-5.4 34.1-4.3 68.3-4.3 102.7 0 15.8-.9 32.3 4.8 47.4 7.4 19.4 19.2 34.7 36.5 46.2 13.5 8.9 30.6 13.2 46.6 13.4 7.8.1 15.6 0 23.4 0h558.4c20.9 0 41-18.4 40-40-1-21.8-17.6-40.1-40.1-40.1z"></path></svg>
                        <span className="mr-4 text-black font-semibold">{props.userName}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" enable-background="new 0 0 512 512" viewBox="0 0 512 512" id="down-arrow"><path d="M256.372,456.118c-2.303,0-4.605-0.878-6.363-2.635L20.418,223.967c-3.516-3.515-3.517-9.213-0.002-12.729c3.513-3.516,9.212-3.516,12.728-0.002l223.227,223.155l223.148-223.154c3.516-3.514,9.213-3.514,12.729,0c3.515,3.515,3.515,9.213,0,12.729L262.735,453.482C260.979,455.239,258.675,456.118,256.372,456.118z"></path><path d="M256.372,302.882c-2.303,0-4.605-0.878-6.363-2.635L20.418,70.73c-3.516-3.514-3.517-9.212-0.002-12.728c3.513-3.516,9.212-3.516,12.728-0.002l223.227,223.154L479.519,58.002c3.516-3.515,9.213-3.516,12.729,0c3.515,3.515,3.515,9.213,0,12.728L262.735,300.246C260.979,302.003,258.675,302.882,256.372,302.882z"></path></svg>
                    </button>
                    {showMenu && (
                        <div className="absolute right-24 lg:right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                            <button onClick={() => navigate("/")} className="block px-4 py-2 w-full text-gray-800 hover:bg-gray-200">Home</button>
                            <button onClick={() => navigate("/profile")} className="block px-4 py-2 w-full text-gray-800 hover:bg-gray-200">My Account</button>
                            <button className="block px-4 py-2 w-full text-gray-800 hover:bg-gray-200" onClick={() => { props.logOut(); navigate("/") }}>Logout</button>
                        </div>
                    )}
                </div>
            }
        </nav>
    );
}
