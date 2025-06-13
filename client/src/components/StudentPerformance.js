import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentPerformance.css';

function StudentPerformance() {
    const { studentId, subjectId } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`https://clarytix-backend.onrender.com/admin/student-performance?studentId=${studentId}&subjectId=${subjectId}`)
            .then(res => res.json())
            .then(res => {
                if (res.success) setData(res.performance);
            });
    }, [studentId, subjectId]);

    return (
        <div className="performance-container">
            <h2>Student Performance</h2>
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
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.topic}</td>
                            <td>{row.score}</td>
                            <td>{row.class_avg}</td>
                            <td>{row.highest_score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentPerformance;
