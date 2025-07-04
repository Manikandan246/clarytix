import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import LogoutButton from './LogoutButton';

const subjectColorMap = {
  "English": "#ffc107",
  "Mathematics": "#17a2b8",
  "Science": "#28a745",
  "Science - Physical Science": "#20c997",
  "Science - Biology": "#6f42c1",
  "Science - Physics": "#6610f2",
  "Science - Chemistry": "#8a2be2",
  "Social Science": "#fd7e14",
  "Social Science - History": "#dc3545",
  "Social Science - Geography": "#ff5733",
  "Social Science - Civics": "#b8860b",
  "Social Science - Economics": "#d63384",
  "Physics": "#007bff",
  "Chemistry": "#483d8b",
  "Biology": "#3cb371",
  "Computer Science": "#20b2aa",
  "Commerce": "#17a2b8",
  "Economics": "#ff851b",
  "Accountancy": "#6c757d",
  "Business Mathematics": "#00796b",
  "Computer Application": "#00bcd4",
  "Environmental Science": "#4caf50",
  "Default": "#007bff"
};


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
                                <div
  key={quiz.topic_id}
  className="quiz-card"
  style={{
    borderLeft: `6px solid ${subjectColorMap[quiz.subject] || subjectColorMap.Default}`
  }}
>


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
