import React, { useEffect } from 'react';
import './QuizPage.css';

function ResultPage({ results, onBackToDashboard }) {
    const schoolLogo = localStorage.getItem('schoolLogoUrl');

        useEffect(() => {
        window.scrollTo(0, 0); // ✅ Scroll to top when the component mounts
    }, []);

    return (
        <div className="quiz-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
            <h2>Quiz Results</h2>

            {results.map((result, index) => {
                const cardClass = result.correct ? 'result-card correct' : 'result-card incorrect';
                const correctAnswerLetter = result.correctAnswer;
                const correctAnswerText = result[`option_${correctAnswerLetter.toLowerCase()}`];

                return (
                    <div key={index} className={cardClass}>
                        <h4>{index + 1}. {result.questionText}</h4>
                         {result.image_url && (
            <div className="question-image-wrapper">
                <img src={result.image_url} alt="Visual related to the question" className="question-image" />
            </div>
        )}
                        <p>{result.correct ? '✅ Correct' : '❌ Incorrect'}</p>
                        <p><strong>Correct Answer:</strong> {correctAnswerLetter}: {correctAnswerText}</p>
                        <p className="explanation"><strong>Explanation:</strong> {result.explanation}</p>
                    </div>
                );
            })}

            <div className="result-buttons">
                <button className="submit-btn" onClick={onBackToDashboard}>Back to Homepage</button>
            </div>
        </div>
    );
}

export default ResultPage;
