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

    // ✅ Read sectionId from URL query params
    const queryParams = new URLSearchParams(window.location.search);
    const sectionId = queryParams.get('sectionId');
    const [sectionName, setSectionName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                let url = `https://clarytix-backend.onrender.com/admin/question-analysis?topicId=${topicId}&schoolId=${schoolId}`;
                if (sectionId) {
                    url += `&sectionId=${sectionId}`;
                }

                console.log('Requesting analysis with URL:', url);
                const response = await fetch(url);
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
    }, [topicId, schoolId, sectionId]);

    useEffect(() => {
        const fetchSectionName = async () => {
            if (sectionId) {
                try {
                    const response = await fetch(`https://clarytix-backend.onrender.com/admin/section-name?sectionId=${sectionId}`);
                    const data = await response.json();
                    if (data.success && data.sectionName) {
                        setSectionName(data.sectionName);
                    }
                } catch (err) {
                    console.error("Failed to fetch section name", err);
                }
            }
        };
    
        fetchSectionName();
    }, [sectionId]);

    return (
        <div className="defaulters-wrapper">
            <div className="defaulters-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
                <h2>Question Analysis</h2>
                <p className="defaulters-subtitle">
                    {topicDetails.className}
                    {sectionName ? ` - Section ${sectionName}` : ''}
                    {' - '}
                    {topicDetails.subject} - {topicDetails.topic}
                </p>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="table-scroll-wrapper">
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
                    </div>
                )}

                <div className="button-group">
                    <button onClick={() => navigate('/admin-dashboard')}>Back to Homepage</button>
                </div>
            </div>
        </div>
    );
}

export default QuestionAnalysis;
