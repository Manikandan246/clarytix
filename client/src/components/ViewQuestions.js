import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewQuestions.css';

function ViewQuestions() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const schoolLogo = localStorage.getItem('schoolLogoUrl');

    const [questions, setQuestions] = useState([]);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(true);

    const borderColors = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6610f2', '#dc3545'];

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`https://clarytix-backend.onrender.com/quiz/questions?topicId=${topicId}`);
                const data = await res.json();

                if (data.success) {
                    setQuestions(data.questions);
                    setSubject(data.subject);
                    setTopic(data.topic);
                } else {
                    alert('Failed to load questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                alert('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [topicId]);

    if (loading) {
        return <div>Loading questions...</div>;
    }

    return (
        <div className="view-questions-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
            <h2>{subject} - {topic}</h2>

            {questions.map((q, index) => (
                <div
                    key={q.id}
                    className="question-card"
                    style={{ borderLeftColor: borderColors[index % borderColors.length] }}
                >
                    <h4>Q{index + 1}. {q.question_text}</h4>
                    <ul className="option-list">
                        <li><strong>A:</strong> {q.option_a}</li>
                        <li><strong>B:</strong> {q.option_b}</li>
                        <li><strong>C:</strong> {q.option_c}</li>
                        <li><strong>D:</strong> {q.option_d}</li>
                    </ul>
                    <p className="correct-answer"><strong>Correct Answer:</strong> {q.correct_option.toUpperCase()}</p>
                    <p className="explanation"><strong>Explanation:</strong> {q.explanation}</p>
                </div>
            ))}

            <div className="result-buttons">
                <button onClick={() => navigate('/admin/home')}>Go to Homepage</button>
            </div>
        </div>
    );
}

export default ViewQuestions;
