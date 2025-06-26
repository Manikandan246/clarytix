import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OldQuizDashboard.css';

function OldQuizDashboard() {
    const studentName = localStorage.getItem('username') || 'Student';
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const studentId = localStorage.getItem('userId');
    const [oldQuizzes, setOldQuizzes] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizHistory = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/student/old-quizzes?studentId=${studentId}`);
                const data = await response.json();
                if (data.success) {
                    setOldQuizzes(data.oldQuizzes);
                } else {
                    setOldQuizzes([]);
                }
            } catch (error) {
                console.error('Error fetching quiz history:', error);
                setOldQuizzes([]);
                alert('Error connecting to server');
            }
        };

        fetchQuizHistory();
    }, [studentId]);

    const subjectOptions = [...new Set(oldQuizzes.map(q => q.subject))];

    const topicOptions = oldQuizzes
        .filter(q => q.subject === selectedSubject)
        .map(q => ({ topic: q.topic, topic_id: q.topic_id }));

    const handleRetake = () => {
        navigate(`/quiz/${selectedTopicId}`);
    };

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

                <div className="card">
                    <h3 className="card-title">Previous Quizzes ({oldQuizzes.length})</h3>
                    <div className="dropdown-row">
                        <select
                            className="dropdown"
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedTopicId('');
                            }}
                        >
                            <option value="">Subject</option>
                            {subjectOptions.map((subj, idx) => (
                                <option key={idx} value={subj}>{subj}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">Select Topic</option>
                            {topicOptions.map((q, idx) => (
                                <option key={idx} value={q.topic_id}>{q.topic}</option>
                            ))}
                        </select>

                        <button
                            className="track-btn"
                            disabled={!selectedSubject || !selectedTopicId}
                            onClick={handleRetake}
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>

                <div className="logout-container">
                    <button className="start-btn" onClick={() => navigate('/student-dashboard')}>
                        Go to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OldQuizDashboard;
