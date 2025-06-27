import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClassDetailsPage.css';

function ClassDetailsPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [classDetails, setClassDetails] = useState([]);
    const [meta, setMeta] = useState({});
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = localStorage.getItem('schoolId');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`https://clarytix-backend.onrender.com/admin/class-details?topicId=${topicId}&schoolId=${schoolId}`);
                const data = await res.json();
                if (data.success) {
                    setClassDetails(data.details);
                    setMeta(data.meta);
                } else {
                    alert('Failed to load class details');
                }
            } catch (error) {
                console.error('Error fetching class details:', error);
            }
        };

        fetchDetails();
    }, [topicId, schoolId]);

    return (
        <div className="cd-wrapper">
            <div className="cd-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
                <h2>Class Details</h2>
                <p>{meta.className} - {meta.subject} - {meta.topic}</p>

                <table className="cd-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Score</th>
                            <th>Time Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classDetails.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.username}</td>
                                <td>{row.score}</td>
                                <td>{row.time_taken || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="cd-buttons">
                    <button onClick={() => navigate('/admin-dashboard')}>Go to Homepage</button>
                </div>
            </div>
        </div>
    );
}

export default ClassDetailsPage;
