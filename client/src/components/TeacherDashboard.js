import React, { useEffect, useState } from 'react';
import './TeacherDashboard.css';
import LogoutButton from './LogoutButton';

function TeacherDashboard() {
    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const teacherId = localStorage.getItem('userId');

    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');

    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    setSubjects(data.success ? data.subjects : []);
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
                    setTopics(data.success ? data.topics : []);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, selectedSubject, schoolId]);

    const clearForm = () => {
        setSelectedClass('');
        setSelectedSubject('');
        setTopics([]);
        setSelectedTopicId('');
    };

    const showMessage = (text, color = 'green') => {
        setMessageColor(color);
        setMessage(text);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSendQuiz = () => {
        fetch(`https://clarytix-backend.onrender.com/teacher/assign-quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId,
                className: selectedClass,
                subjectId: selectedSubject,
                topicId: selectedTopicId,
                teacherId
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage('Quiz sent successfully!', 'green');
            } else if (data.message === 'Quiz already assigned.') {
                showMessage('Quiz has already been sent.', 'red');
            } else {
                showMessage('Failed to send quiz. Try again.', 'red');
            }
            clearForm(); // Always clear fields after any response
        })
        .catch(() => {
            showMessage('Server error. Try again.', 'red');
            clearForm(); // Clear fields even on error
        });
    };

    return (
        <div className="teacher-dashboard-wrapper">
            <div className="teacher-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />

                <div className="card teacher-card">
                    <h3 className="card-title center-title">Select Topic</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select className="dropdown" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
                            <option value="">Subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>

                        <select className="dropdown" value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} disabled={!selectedSubject}>
                            <option value="">Topic</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>

                        <button className="track-btn" disabled={!selectedClass || !selectedSubject || !selectedTopicId} onClick={handleSendQuiz}>
                            Send Quiz
                        </button>
                    </div>
                    {message && <div className="msg" style={{ color: messageColor }}>{message}</div>}
                </div>

                <div className="logout-container">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
