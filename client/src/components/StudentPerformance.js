import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './StudentPerformance.css';

function StudentPerformance() {
    const location = useLocation();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const studentId = queryParams.get('studentId');
    const subjectId = queryParams.get('subjectId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://clarytix-backend.onrender.com/admin/student-performance?studentId=${studentId}&subjectId=${subjectId}`
                );
                const data = await response.json();
                if (data.success) {
                    setRecords(data.records);
                } else {
                    setError('No data found');
                }
            } catch (err) {
                console.error('Error fetching performance', err);
                setError('Server error');
            } finally {
                setLoading(false);
            }
        };

        if (studentId && subjectId) {
            fetchData();
        } else {
            setError('Missing student or subject ID');
            setLoading(false);
        }
    }, [studentId, subjectId]);

    return (
        <div className="performance-wrapper">
            <div className="performance-container">
                <h2 className="performance-title">Student Performance</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-msg">{error}</p>
                ) : records.length === 0 ? (
                    <p>No records available.</p>
                ) : (
                    <table className="performance-table">
                        <thead>
                            <tr>
                                <th>Topic</th>
                                <th>Score</th>
                                <th>Class Avg</th>
                                <th>Highest Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.topic}</td>
                                    <td>{row.score}</td>
                                    <td>{row.class_avg}</td>
                                    <td>{row.highest_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default StudentPerformance;
