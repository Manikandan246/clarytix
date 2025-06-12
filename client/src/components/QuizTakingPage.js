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

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/quiz/questions?topicId=${topicId}`);
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
        console.log('Answers object:', answers);  // ✅ log answers to console

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

        try {
            const response = await fetch('https://clarytix-backend.onrender.com/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    topicId,
                    answers: formattedAnswers
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

    if (loading) {
        return <div>Loading quiz...</div>;
    }

    return (
        <div className="quiz-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo" />
            <h2>{subject} - {topic}</h2>
            {questions.map((q) => (
                <div key={q.id} className="question-block">
                    <p className="question-text">{q.question_text}</p>
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
                                {opt}: {q[`option_${opt.toLowerCase()}`]}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button onClick={handleSubmit}>
                Submit Quiz
            </button>
        </div>
    );
}

export default QuizTakingPage;
