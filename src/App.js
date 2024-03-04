import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NavBar from './components/NavBar';
import Create from './pages/Create';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Swal from 'sweetalert2';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [userName, setUserName] = useState("Chayan Surana");
  const [userEmail, setUserEmail] = useState("-");
  const [quizzes, setQuizzes] = useState([]);
  const [id, setId] = useState(0);
  const [quizBeingAttempted, setQuizBeingAttempted] = useState(false); 

  const LogIn = () => setLoggedIn(true);
  const LogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout of your account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        setLoggedIn(false);
      }
    })
  }
  const setName = (name) => setUserName(name);
  const increaseId = () => setId(id + 1);
  const attempting = () => setQuizBeingAttempted(previousState => !previousState);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch("/.netlify/functions/verify", {
            method: "GET",
            headers: {
              "Authorization": token
            }
          });
          if (response.status === 200) {
            const data = await response.json();
            setLoggedIn(true);
            console.log(data);
            setUserName(data.userName);
            setUserEmail(data.userEmail);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    
    const fetchData = async () => {
      try {
        const response = await fetch("/.netlify/functions/fetchQuiz");
        const data = await response.json();
        setQuizzes(data);
        console.log("Fetched all quizzes");
        console.log(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    checkLoginStatus();
    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        <NavBar quizzes={quizzes} loggedIn={loggedIn} userName={userName} logOut={LogOut} display={!quizBeingAttempted}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login LogIn={LogIn} setName={setName} userName={userName} userEmail={userEmail} />} />
          <Route path="/signup" element={<SignUp LogIn={LogIn} setName={setName} userName={userName} userEmail={userEmail} />} />
          <Route path="/create" element={<Create loggedIn={loggedIn} userName={userName} userEmail={userEmail} id={id} increaseId={increaseId} />} />
          <Route path="/explore" element={<Explore loggedIn={loggedIn} quizzes={quizzes} attempting={attempting} userName={userName} userEmail={userEmail} />} />
          <Route path="/profile" element={<Profile userName={userName} userEmail={userEmail}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
