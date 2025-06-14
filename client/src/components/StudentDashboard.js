import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import LogoutButton from './LogoutButton';

function StudentDashboard() {
    const studentName = localStorage.getItem('username') || 'Student';
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const studentId = localStorage.getItem('userId');
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/student/quizzes?studentId=${studentId}`);
                const data = await response.json();
                if (data.success && Array.isArray(data.availableQuizzes)) {
                    setAvailableQuizzes(data.availableQuizzes);
                } else {
                    setAvailableQuizzes([]);
                    console.warn('Unexpected quiz data:', data);
                }
            } catch (error) {
                console.error('Error fetching quizzes', error);
                setAvailableQuizzes([]);
                alert('Error connecting to server');
            }
        };

        fetchQuizzes();
    }, [studentId]);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <img
                    src={schoolLogo}
                    alt="School Logo"
                     className="school-logo-large"
                    onError={(e) => { e.target.src = '/fallback-logo.png'; }}
                />
                <h1 className="welcome">Hi, {studentName}</h1>

                <section>
                  <h2 className="section-title" style={{ textAlign: 'left' }}>
  Available Quizzes ({availableQuizzes.length})
</h2>

                    <div className="quiz-cards-wrapper">
                        {Array.isArray(availableQuizzes) && availableQuizzes.length > 0 ? (
                            availableQuizzes.map((quiz) => (
                                <div key={quiz.topic_id} className={`quiz-card ${quiz.subject.toLowerCase()}`}>

                                    <p><strong>Subject:</strong> {quiz.subject}</p>
                                    <p><strong>Topic:</strong> {quiz.topic}</p>
                                    <button
                                        className="start-btn"
                                        onClick={() => navigate(`/quiz/${quiz.topic_id}`)}
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-quizzes-text">No available quizzes</p>
                        )}
                    </div>
                </section>

                <div className="centered-buttons">
                    <button
                        className="start-btn"
                        onClick={() => navigate('/old-quizzes')}
                    >
                        Access Previous Quizzes
                    </button>
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
