import React from 'react';
import './QuizPage.css';

function ResultPage({ results, onBackToDashboard }) {
    const schoolLogo = localStorage.getItem('schoolLogoUrl');

    return (
        <div className="quiz-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo" />
            <h2>Quiz Results</h2>

            {results.map((result, index) => (
                <div key={result.questionId} className="question-block">
                    <h4 className="question-text">{index + 1}. {result.questionText}</h4>

                    <p>
                        {result.correct ? '✅ Correct' : '❌ Incorrect'}
                    </p>
                    <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                    <p><strong>Explanation:</strong> {result.explanation}</p>
                </div>
            ))}

            <button className="submit-btn" onClick={onBackToDashboard}>
                Back to Homepage
            </button>
        </div>
    );
}

export default ResultPage;
