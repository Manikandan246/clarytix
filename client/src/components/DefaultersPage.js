import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DefaultersPage.css';

function DefaultersPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [defaulters, setDefaulters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topicDetails, setTopicDetails] = useState({});
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = Number(localStorage.getItem('schoolId'));

    useEffect(() => {
          window.scrollTo(0, 0);
        const fetchDefaulters = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/admin/defaulters?topicId=${topicId}&schoolId=${schoolId}`);
                const data = await response.json();
                if (data.success) {
                    setDefaulters(data.defaulters);
                    setTopicDetails({
                        className: data.classname || '',
                        subject: data.subject || '',
                        topic: data.topic || ''
                    });
                } else {
                    setDefaulters([]);
                }
            } catch (err) {
                console.error('Error fetching defaulters', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDefaulters();
    }, [topicId, schoolId]);

    return (
        <div className="defaulters-wrapper">
            <div className="defaulters-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
                <h2>Students Yet to Attempt</h2>
                <p className="defaulters-subtitle">
                    {topicDetails.className} - {topicDetails.subject} - {topicDetails.topic}
                </p>

                {loading ? (
                    <p>Loading...</p>
                ) : defaulters.length === 0 ? (
                    <p>No defaulters found 🎉</p>
                ) : (
                    <table className="defaulters-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaulters.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="button-group">
                    <button onClick={() => navigate('/admin-dashboard')}>Back to Homepage</button>
                </div>
            </div>
        </div>
    );
}

export default DefaultersPage;
