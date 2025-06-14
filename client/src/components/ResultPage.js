import React from 'react';
import './QuizPage.css';

function ResultPage({ results, onBackToDashboard }) {
    const schoolLogo = localStorage.getItem('schoolLogoUrl');

    return (
        <div className="quiz-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo" />
            <h2>Quiz Results</h2>

           {results.map((result, index) => {
    const cardClass = result.correct ? 'result-card correct' : 'result-card incorrect';
    const correctAnswerLetter = result.correctAnswer;
    const correctAnswerText = result[`option_${correctAnswerLetter.toLowerCase()}`];

    return (
        <div key={index} className={cardClass}>
            <h4>{index + 1}. {result.questionText}</h4>
            <p>{result.correct ? '✅ Correct' : '❌ Incorrect'}</p>
            <p><strong>Correct Answer:</strong> {correctAnswerLetter}: {correctAnswerText}</p>
            <p className="explanation"><strong>Explanation:</strong> {result.explanation}</p>
        </div>
    );
})}


            <button className="submit-btn" onClick={onBackToDashboard}>
                Back to Homepage
            </button>
        </div>
    );
}

export default ResultPage;
