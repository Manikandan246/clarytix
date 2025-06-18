import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DefaultersPage.css'; // Reuse styles

function QuestionAnalysis() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = Number(localStorage.getItem('schoolId'));

    const [loading, setLoading] = useState(true);
    const [topicDetails, setTopicDetails] = useState({});
    const [analysis, setAnalysis] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/admin/question-analysis?topicId=${topicId}&schoolId=${schoolId}`);
                const data = await response.json();
                if (data.success) {
                    setTopicDetails({
                        className: data.classname || '',
                        subject: data.subject || '',
                        topic: data.topic || ''
                    });
                    setAnalysis(data.analysis || []);
                } else {
                    setAnalysis([]);
                }
            } catch (err) {
                console.error('Error fetching question analysis', err);
                setAnalysis([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [topicId, schoolId]);

    return (
        <div className="defaulters-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
            <h2>Question Analysis</h2>
            <p className="topic-subtitle">
                {topicDetails.className} - {topicDetails.subject} - {topicDetails.topic}
            </p>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="defaulters-table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Total Responses</th>
                            <th>Incorrect</th>
                            <th>Correct</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analysis.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.question_text}</td>
                                <td>{row.total}</td>
                                <td>{row.incorrect}</td>
                                <td>{row.correct}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="back-button-container">
                <button onClick={() => navigate('/admin-dashboard')}>Back to Homepage</button>
            </div>
        </div>
    );
}

export default QuestionAnalysis;
