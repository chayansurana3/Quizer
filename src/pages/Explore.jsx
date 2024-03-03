import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Quiz from "../components/Quiz";
import Score from "../components/Score";
import Quiz1 from "../images/quiz1.jpg";
import Quiz2 from "../images/quiz2.avif";
import Quiz3 from "../images/quiz3.jpg";
import Quiz4 from "../images/quiz4.jpg";
import Quiz5 from "../images/quiz5.jpg";
import Quiz6 from "../images/quiz6.jpg";
import Quiz7 from "../images/quiz7.jpg";
import Quiz8 from "../images/quiz8.png";
import Swal from "sweetalert2";

export default function Explore(props) {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.loggedIn){
      navigate("/login");
      return;
    }
    setQuizzes(props.quizzes);
    console.log("Started");
  }, [props.quizzes, navigate, props.loggedIn, setQuizzes]);

  const getImageByQuizId = (id) => {
    switch (id) {
      case 1: return Quiz1;
      case 2: return Quiz2;
      case 3: return Quiz3;
      case 4: return Quiz4;
      case 5: return Quiz5;
      case 6: return Quiz6;
      case 7: return Quiz7;
      case 8: return Quiz8;
      default: return null;
    }
  }

  const startQuiz = (quizId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Start Quiz!"
    }).then((result) => {
      if (result.isConfirmed) {
        props.attempting();
        setSelectedQuiz(quizzes.find(quiz => quiz.id === quizId));
      }
    })
  }

  const closeQuiz = async ({ answers, timeLeft }) => {
    props.attempting();
    setTotalTimeTaken(selectedQuiz.time - timeLeft);
    let score = markQuiz(answers);
    setUserScore(score);

    const requestBody = {
      id: selectedQuiz.id,
      email: props.userEmail,
      title: selectedQuiz.title,
      score: score,
    };

    console.log(requestBody);

    try {
      Swal.fire({
        title: 'Submitting...',
        allowOutsideClick: false,
        onBeforeOpen: () => Swal.showLoading()
      });
      const response = await fetch('/.netlify/functions/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Score updated successfully:', data);
      Swal.close();
    } catch (error) {
      console.error('Error updating score:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to submit score. Please try again later.',
      });
    }
    setQuizCompleted(true);
  };

  const markQuiz = (answers) => {
    let score = 0;
    answers.forEach((answer, index) => {
      const correctOption = selectedQuiz.questions[index].correctOption;
      if (answer === correctOption) score++;
    });
    return score;
  }

  return (
    <div>
      {quizCompleted ? (
        <Score
          quizName={selectedQuiz.title}
          userScore={userScore}
          totalQuestions={selectedQuiz.questions.length}
          totalTimeTaken={totalTimeTaken}
          totalTime={selectedQuiz.time}
        />
      ) : (
        <div>
          <div className={`mt-28 flex flex-row ${selectedQuiz ? 'hidden' : ''}`}>
            {!selectedQuiz && (
              <div className="flex flex-wrap">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-2 mb-8">
                    <Card
                      image={getImageByQuizId(quiz.id)}
                      title={quiz.title}
                      author={quiz.author}
                      totalTime={quiz.time}
                      onStartQuiz={() => startQuiz(quiz.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-0">
            {selectedQuiz && (
              <Quiz
                name={selectedQuiz.title}
                problems={selectedQuiz.questions}
                timeLimit={selectedQuiz.time}
                onClose={closeQuiz}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
