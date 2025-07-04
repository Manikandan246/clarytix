import React, { useEffect, useState } from 'react';
import './TeacherDashboard.css';
import LogoutButton from './LogoutButton';

function TeacherDashboard() {
    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const teacherId = localStorage.getItem('userId');

    const [selectedClass, setSelectedClass] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [chapters, setChapters] = useState([]);
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');

    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/sections?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    setSections(data.success ? data.sections : []);
                    setSelectedSectionId('');
                });

            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    setSubjects(data.success ? data.subjects : []);
                    setSelectedSubject('');
                    setChapters([]);
                    setSelectedChapterId('');
                    setTopics([]);
                    setSelectedTopicId('');
                });
        } else {
            setSections([]);
            setSubjects([]);
            setChapters([]);
            setTopics([]);
            setSelectedSectionId('');
            setSelectedSubject('');
            setSelectedChapterId('');
            setSelectedTopicId('');
        }
    }, [selectedClass, schoolId]);

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`https://clarytix-backend.onrender.com/admin/chapters?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedSubject}`)
                .then(res => res.json())
                .then(data => {
                    setChapters(data.success ? data.chapters : []);
                    setSelectedChapterId('');
                    setTopics([]);
                    setSelectedTopicId('');
                });
        } else {
            setChapters([]);
            setSelectedChapterId('');
            setTopics([]);
            setSelectedTopicId('');
        }
    }, [selectedClass, selectedSubject, schoolId]);

    useEffect(() => {
        if (selectedChapterId) {
            fetch(`https://clarytix-backend.onrender.com/admin/topics?schoolId=${schoolId}&chapterId=${selectedChapterId}`)
                .then(res => res.json())
                .then(data => {
                    setTopics(data.success ? data.topics : []);
                    setSelectedTopicId('');
                });
        } else {
            setTopics([]);
            setSelectedTopicId('');
        }
    }, [selectedChapterId, schoolId]);

    const clearForm = () => {
        setSelectedClass('');
        setSelectedSectionId('');
        setSelectedSubject('');
        setSelectedChapterId('');
        setSelectedTopicId('');
        setTopics([]);
        setChapters([]);
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
                teacherId,
                sectionId: selectedSectionId || null
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
                clearForm();
            })
            .catch(() => {
                showMessage('Server error. Try again.', 'red');
                clearForm();
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

                        {sections.length > 0 && (
                            <select className="dropdown" value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)}>
                                <option value="">Section</option>
                                {sections.map(section => (
                                    <option key={section.id} value={section.id}>{section.section_name}</option>
                                ))}
                            </select>
                        )}

                        <select className="dropdown" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
                            <option value="">Subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>

                        {chapters.length > 0 && (
                            <select className="dropdown" value={selectedChapterId} onChange={(e) => setSelectedChapterId(e.target.value)} disabled={!selectedSubject}>
                                <option value="">Chapter</option>
                                {chapters.map(ch => (
                                    <option key={ch.id} value={ch.id}>{ch.chapter_name}</option>
                                ))}
                            </select>
                        )}

                        <select className="dropdown" value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} disabled={!selectedChapterId}>
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
