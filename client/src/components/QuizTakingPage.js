import React, { useState, useEffect } from 'react';
import './QuizPage.css';

function QuizTakingPage({ topicId, onQuizComplete }) {
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const userId = localStorage.getItem('userId');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [startTime, setStartTime] = useState(null); // ✅ Track start time

    const borderColors = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6610f2', '#dc3545'];

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/quiz/questions?topicId=${topicId}`);
                const data = await response.json();
                if (data.success) {
                    setQuestions(data.questions);
                    setSubject(data.subject);
                    setTopic(data.topic);
                    setStartTime(Date.now()); // ✅ Start time set after quiz loads
                } else {
                    alert('Failed to load questions');
                }
            } catch (error) {
                console.error('Error fetching questions', error);
                alert('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [topicId]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        const unanswered = questions.find(q => !(q.id in answers));
        if (unanswered) {
            const questionNumber = questions.findIndex(q => q.id === unanswered.id) + 1;
            alert(`Please answer question ${questionNumber} before submitting.`);
            return;
        }

        const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
            questionId: parseInt(questionId),
            selectedOption
        }));

        // ✅ Time tracking
        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - startTime) / 1000);
        
        const timeTaken = totalSeconds;

        try {
            const response = await fetch('https://clarytix-backend.onrender.com/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    topicId,
                    answers: formattedAnswers,
                    timeTaken // ✅ Send to backend
                })
            });

            const data = await response.json();
            if (data.success) {
                onQuizComplete(data.results);
            } else {
                alert('Failed to submit quiz');
            }
        } catch (error) {
            console.error('Error submitting quiz', error);
            alert('Error connecting to server');
        }
    };

    if (loading) return <div>Loading quiz...</div>;

    return (
        <div className="quiz-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
            <h2>{subject} - {topic}</h2>
            {questions.map((q, index) => (
                <div
                    key={q.id}
                    className="quiz-question-card"
                    style={{ borderLeft: `6px solid ${borderColors[index % borderColors.length]}` }}
                >
                    <h4>Q{index + 1}. {q.question_text}</h4>

                    {q.image_url && (
                        <div className="question-image-wrapper">
                            <img src={q.image_url} alt="Visual related to the question" className="question-image" />
                        </div>
                    )}

                    <div className="options">
                        {['A', 'B', 'C', 'D'].map((opt) => (
                            <label key={opt} className={`option-label ${answers[q.id] === opt ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name={`question_${q.id}`}
                                    value={opt}
                                    checked={answers[q.id] === opt}
                                    onChange={() => handleOptionSelect(q.id, opt)}
                                />
                                <span><strong>{opt}:</strong> {q[`option_${opt.toLowerCase()}`]}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button className="submit-btn" onClick={handleSubmit}>Submit Quiz</button>
        </div>
    );
}

export default QuizTakingPage;