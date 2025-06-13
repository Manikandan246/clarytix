import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    

    const navigate = useNavigate();
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = localStorage.getItem('schoolId');

    const classOptions = [
        'Class 5', 'Class 6', 'Class 7', 'Class 8',
        'Class 9', 'Class 10', 'Class 11', 'Class 12'
    ];

    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setSubjects(data.subjects);
                        setSelectedSubject('');
                        setTopics([]);
                        setSelectedTopic('');
                    }
                })
                .catch(error => {
                    console.error("Error fetching subjects", error);
                });
        }
    }, [selectedClass, schoolId]);

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`https://clarytix-backend.onrender.com/admin/topics?className=${selectedClass}&subjectId=${selectedSubject}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setTopics(data.topics);
                        setSelectedTopic('');
                    }
                })
                .catch(error => {
                    console.error("Error fetching topics", error);
                });
        }
    }, [selectedClass, selectedSubject]);

    const handleTrack = () => {
        if (selectedTopic) {
            navigate(`/admin/performance/${selectedTopic}`);
        }
    };

    return (
        <div className="admin-dashboard-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-full" />
            <h2 className="admin-welcome">Welcome Admin</h2>

            <div className="track-section">
                <h3>Track Performance Topic Wise</h3>

                <div className="dropdown-row">
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        <option value="">Select Class</option>
                        {classOptions.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
                        <option value="">Select Subject</option>
                        {subjects.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>

                    <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} disabled={!selectedSubject}>
                        <option value="">Select Topic</option>
                        {topics.map(top => (
                            <option key={top.id} value={top.id}>{top.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="track-btn"
                    onClick={handleTrack}
                    disabled={!selectedClass || !selectedSubject || !selectedTopic}
                >
                    Track Performance
                </button>
            </div>

            <div className="logout-container">
                <LogoutButton />
            </div>
        </div>
    );
}

export default AdminDashboard;
