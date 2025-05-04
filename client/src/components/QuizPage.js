import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizPage.css';

function QuizPage() {
    const { topicId } = useParams();
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const studentId = localStorage.getItem('userId');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/quiz/questions?topicId=${topicId}`);
                const data = await response.json();
                if (data.success) {
                    setQuestions(data.questions);
                    setSubject(data.subject);
                    setTopic(data.topic);
                } else {
                    alert('Failed to load questions');
                }
            } catch (error) {
                console.error('Error fetching questions', error);
                alert('Error connecting to server');
            }
        };

        fetchQuestions();
    }, [topicId]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    };

    const handleSubmit = async () => {
        const unanswered = questions.find(q => !answers[q.id]);
        if (unanswered) {
            alert(`Please answer question ${questions.indexOf(unanswered) + 1}`);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/student/submit-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    topicId,
                    answers
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Quiz submitted successfully!');
                navigate('/student-dashboard');
            } else {
                alert('Failed to submit quiz');
            }
        } catch (error) {
            console.error('Error submitting quiz', error);
            alert('Error connecting to server');
        }
    };

    return (
        <div className="quiz-wrapper">
            <div className="quiz-container">
                <img src={schoolLogo} alt="School Logo" className="quiz-logo" />
                <h2 className="quiz-title">{subject} - {topic}</h2>

                {questions.map((q, index) => (
                    <div key={q.id} className="quiz-question">
                        <h4>{index + 1}. {q.question_text}</h4>
                        {['A', 'B', 'C', 'D'].map(option => (
                            <label key={option} className="quiz-option">
                                <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    value={option}
                                    checked={answers[q.id] === option}
                                    onChange={() => handleAnswerChange(q.id, option)}
                                />
                                {`${option}: ${q[`option_${option.toLowerCase()}`]}`}
                            </label>
                        ))}
                    </div>
                ))}

                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default QuizPage;
