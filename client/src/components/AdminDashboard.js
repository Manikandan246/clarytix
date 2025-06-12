import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = localStorage.getItem('schoolId');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/admin/quizzes?schoolId=${schoolId}`);
                const data = await response.json();
                if (data.success) {
                    setQuizzes(data.availableQuizzes);
                } else {
                    alert('Failed to load quizzes');
                }
            } catch (error) {
                console.error('Error fetching quizzes', error);
                alert('Error connecting to server');
            }
        };
        fetchQuizzes();
    }, [schoolId]);

    const handleTrackPerformance = (topicId) => {
        navigate(`/admin/performance/${topicId}`);
    };

    return (
        <div className="admin-dashboard-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-full" />
            <h2 className="admin-welcome">Welcome Admin</h2>

            <div className="table-wrapper">
                <table className="performance-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz, index) => (
                            <tr key={index}>
                                <td>{quiz.class}</td>
                                <td>{quiz.subject}</td>
                                <td className="nowrap">{quiz.topic}</td>
                                <td>
                                    <button className="track-btn" onClick={() => handleTrackPerformance(quiz.topic_id)}>
                                        Track Performance
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="logout-container">
                <LogoutButton />
            </div>
        </div>
    );
}

export default AdminDashboard;
