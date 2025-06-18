import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewQuestions.css';

function QuestionAnalysis() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://clarytix-backend.onrender.com/admin/question-analysis?topicId=${topicId}`)
            .then(res => res.json())
            .then(result => {
                if (result.success) setData(result.analysis);
                else alert('Failed to fetch analysis');
            })
            .catch(err => {
                console.error(err);
                alert('Server error');
            })
            .finally(() => setLoading(false));
    }, [topicId]);

    if (loading) return <div>Loading analysis...</div>;

    return (
        <div className="view-questions-container">
            <h2>Question Analysis</h2>
            <table className="analysis-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Total Responses</th>
                        <th>Incorrect</th>
                        <th>Correct</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.question_text}</td>
                            <td>{row.total}</td>
                            <td>{row.incorrect}</td>
                            <td>{row.correct}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="result-buttons">
                <button onClick={() => navigate('/admin-dashboard')}>Go to Homepage</button>
            </div>
        </div>
    );
}

export default QuestionAnalysis;
