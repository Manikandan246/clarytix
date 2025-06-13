import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OldQuizDashboard.css';
import LogoutButton from './LogoutButton';

function OldQuizDashboard() {
    const studentName = localStorage.getItem('username') || 'Student';
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const studentId = localStorage.getItem('userId');
    const [oldQuizzes, setQuizHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizHistory = async () => {
            console.log('Student ID from localStorage:', studentId);  // ✅ Debug studentId
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/student/old-quizzes?studentId=${studentId}`);
                const data = await response.json();
                console.log('Response from backend /student/old-quizzes:', data); // ✅ Debug response

                if (data.success && Array.isArray(data.oldQuizzes)) {
                    setQuizHistory(data.oldQuizzes);
                } else {
                    setQuizHistory([]);
                    console.warn('Unexpected quiz history data format:', data);
                }
            } catch (error) {
                console.error('Error fetching quiz history:', error);
                setQuizHistory([]);
                alert('Error connecting to server');
            }
        };

        fetchQuizHistory();
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
                    <h2 className="section-title" style={{ textAlign: 'left' }}>Quiz History</h2>

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
                                {Array.isArray(oldQuizzes) && oldQuizzes.length > 0 ? (
                                    oldQuizzes.map((quiz) => (
                                        <tr key={quiz.topic_id}>
                                            <td>{quiz.subject}</td>
                                            <td>{quiz.topic}</td>
                                            <td>
                                                <button
                                                    className="start-btn"
                                                    onClick={() => navigate(`/quiz/${quiz.topic_id}`)}
                                                >
                                                    Retake Quiz
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No previous quizzes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="action-row">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default OldQuizDashboard;
