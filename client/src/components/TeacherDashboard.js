import React, { useEffect, useState } from 'react';
import './TeacherDashboard.css';

function TeacherDashboard() {
    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');

    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
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

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`https://clarytix-backend.onrender.com/admin/topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedSubject}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setTopics(data.topics);
                    else setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, selectedSubject, schoolId]);

    const handleSendQuiz = () => {
        fetch(`https://clarytix-backend.onrender.com/teacher/send-quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId,
                className: selectedClass,
                subjectId: selectedSubject,
                topicId: selectedTopicId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessage('Quiz sent successfully!');
                } else {
                    setMessage('Failed to send quiz. Try again.');
                }
            })
            .catch(() => setMessage('Server error. Try again.'));
    };

    return (
        <div className="teacher-dashboard-wrapper">
            <div className="teacher-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />

                <div className="card teacher-card">
                    <h3 className="card-title">Select Topic</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                        >
                            <option value="">Subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">Topic</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>

                        <button
                            className="track-btn"
                            disabled={!selectedClass || !selectedSubject || !selectedTopicId}
                            onClick={handleSendQuiz}
                        >
                            Send Quiz
                        </button>
                    </div>
                    {message && <div className="success-msg">{message}</div>}
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
