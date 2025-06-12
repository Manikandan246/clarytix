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
                    className="dashboard-logo"
                    onError={(e) => { e.target.src = '/fallback-logo.png'; }}
                />
                <h1 className="welcome">Hi, {studentName}</h1>

                <section>
                    <h2 className="section-title" style={{ textAlign: 'left' }}>Available Quizzes</h2>
                    
                    <div className="table-wrapper">
                        <table className="quiz-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Topic</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(availableQuizzes) && availableQuizzes.length > 0 ? (
                                    availableQuizzes.map((quiz) => (
                                        <tr key={quiz.topic_id}>
                                            <td>{quiz.subject}</td>
                                            <td>{quiz.topic}</td>
                                            <td>
                                                <button
                                                    className="start-btn"
                                                    onClick={() => navigate(`/quiz/${quiz.topic_id}`)}
                                                >
                                                    Start Quiz
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No available quizzes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="logout-container">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
