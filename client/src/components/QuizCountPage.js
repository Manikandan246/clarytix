import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './UpdatedQuizCountPage.css';

function QuizCountPage() {
    const [searchParams] = useSearchParams();
    const className = searchParams.get('class');
    const subjectId = searchParams.get('subjectId');
    const navigate = useNavigate();

    const [schoolLogo, setSchoolLogo] = useState('');
    const [quizCount, setQuizCount] = useState(0);
    const [studentList, setStudentList] = useState([]);
    const [subjectName, setSubjectName] = useState('');

    const schoolId = localStorage.getItem('schoolId');

    useEffect(() => {
        setSchoolLogo(localStorage.getItem('schoolLogoUrl') || '');
    }, []);

    useEffect(() => {
        if (!className || !subjectId || !schoolId) return;

        fetch(`https://clarytix-backend.onrender.com/admin/quiz-count?schoolId=${schoolId}&className=${className}&subjectId=${subjectId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setQuizCount(data.quizCount);
                    setStudentList(data.students || []);
                    setSubjectName(data.subject || '');
                } else {
                    alert('Failed to fetch quiz count');
                }
            })
            .catch(() => alert('Error connecting to server'));
    }, [className, subjectId, schoolId]);

    return (
        <div className="vc-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
            <h2>{className} - {subjectName}</h2>
            <p className="vc-count">Total Number of Quizzes Sent: <strong>{quizCount}</strong></p>

            <table className="vc-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Unattempted</th>
                        <th>Attempted</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((s, idx) => (
                        <tr key={idx}>
                            <td>{s.username}</td>
                            <td>{s.unattempted}</td>
                            <td>{s.attempted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="vc-button-group">
                <button className="vc-btn" onClick={() => navigate('/admin-dashboard')}>
                    Go to Homepage
                </button>
            </div>
        </div>
    );
}

export default QuizCountPage;
