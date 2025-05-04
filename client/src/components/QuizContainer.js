import React, { useState } from 'react';
import QuizTakingPage from './QuizTakingPage';
import ResultPage from './ResultPage';

function QuizContainer({ topicId }) {
    const [results, setResults] = useState(null);

    return results ? (
        <ResultPage results={results} onBackToDashboard={() => window.location.href = '/student-dashboard'} />
    ) : (
        <QuizTakingPage topicId={topicId} onQuizComplete={setResults} />
    );
}

export default QuizContainer;
