import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');

    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const navigate = useNavigate();

    // Fetch subjects when class changes
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/school-subjects?schoolId=${schoolId}&class=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSubjects(data.subjects);
                    else setSubjects([]);
                    setSelectedSubject('');
                    setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, schoolId]);

    // Fetch topics when subject changes
    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`https://clarytix-backend.onrender.com/school-topics?schoolId=${schoolId}&class=${selectedClass}&subject=${selectedSubject}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setTopics(data.topics);
                    else setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, selectedSubject, schoolId]);

    const handleTrackPerformance = () => {
        if (selectedTopicId) {
            navigate(`/admin/performance/${selectedTopicId}`);
        }
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-full" />
                <h2 className="admin-welcome">Welcome Admin</h2>

                <div className="card">
                    <h3 className="card-title">Track Performance Topic Wise</h3>
                    <div className="dropdown-row">
                        <select
                            className="dropdown"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>
                                    Class {i + 5}
                                </option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                        >
                            <option value="">Subject</option>
                            {subjects.map((subject, index) => (
                                <option key={index} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">Select Topic</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>

                        <button
                            className="track-btn"
                            disabled={!selectedTopicId}
                            onClick={handleTrackPerformance}
                        >
                            Track Performance
                        </button>
                    </div>
                </div>

                <div className="logout-container">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
