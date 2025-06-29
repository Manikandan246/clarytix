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

    const queryParams = new URLSearchParams(window.location.search);
    const sectionId = queryParams.get('sectionId');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                let url = `https://clarytix-backend.onrender.com/admin/class-details?topicId=${topicId}&schoolId=${schoolId}`;
                if (sectionId) {
                    url += `&sectionId=${sectionId}`;
                }

                const res = await fetch(url);
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
    }, [topicId, schoolId, sectionId]);

    function formatSeconds(seconds) {
        if (!seconds || isNaN(seconds)) return '0m 0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    return (
        <div className="cd-wrapper">
            <div className="cd-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
                <h2>Class Performance Details</h2>
                <p>
                    {meta.className}
                    {sectionId ? ` - Section ${sectionId}` : ''}
                    {' - '}
                    {meta.subject} - {meta.topic}
                </p>

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
                                <td>{formatSeconds(row.time_taken)}</td>
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
