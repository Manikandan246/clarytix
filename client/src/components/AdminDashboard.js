import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const navigate = useNavigate();

    // Common
    const [selectedClass, setSelectedClass] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');

    // Topic-wise
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');

    // Student-wise
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [studentSubjects, setStudentSubjects] = useState([]);
    const [selectedStudentSubject, setSelectedStudentSubject] = useState('');

    // View Questions
    const [viewSubjects, setViewSubjects] = useState([]);
    const [selectedViewSubject, setSelectedViewSubject] = useState('');
    const [viewTopics, setViewTopics] = useState([]);
    const [selectedViewTopicId, setSelectedViewTopicId] = useState('');

    // Quiz Count
    const [quizSubjects, setQuizSubjects] = useState([]);
    const [selectedQuizSubject, setSelectedQuizSubject] = useState('');
    const [countSectionId, setCountSectionId] = useState('');

    // Load subjects and sections when class changes
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

            fetch(`https://clarytix-backend.onrender.com/admin/sections?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    setSections(data.success ? data.sections : []);
                    setSelectedSectionId('');
                    setCountSectionId('');
                });
        } else {
            setSubjects([]);
            setSelectedSubject('');
            setTopics([]);
            setSelectedTopicId('');
            setSections([]);
            setSelectedSectionId('');
            setCountSectionId('');
        }
    }, [selectedClass, schoolId]);

    // Assigned topics
    useEffect(() => {
        if (selectedClass && selectedSubject) {
            let url = `https://clarytix-backend.onrender.com/admin/assigned-topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedSubject}`;
            if (selectedSectionId) url += `&sectionId=${selectedSectionId}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setTopics(data.success ? data.topics : []);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, selectedSubject, selectedSectionId, schoolId]);

    const handleTrackTopicWise = () => {
    const sectionPart = selectedSectionId ? `?sectionId=${selectedSectionId}` : '';
    navigate(`/admin/performance/${selectedTopicId}${sectionPart}`);
};


    // Student-wise
    useEffect(() => {
    if (selectedClass) {
        const queryParams = new URLSearchParams();
        queryParams.append('schoolId', schoolId);
        queryParams.append('className', selectedClass);

        if (selectedSectionId) {
            queryParams.append('sectionId', selectedSectionId);
        }

        fetch(`https://clarytix-backend.onrender.com/admin/students?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                setStudents(data.success ? data.students : []);
                setSelectedStudent('');
                setStudentSubjects([]);
                setSelectedStudentSubject('');
            });
    }
}, [selectedClass, selectedSectionId, schoolId]);


    useEffect(() => {
        if (selectedStudent) {
            fetch(`https://clarytix-backend.onrender.com/admin/student-subjects?studentId=${selectedStudent}`)
                .then(res => res.json())
                .then(data => {
                    setStudentSubjects(data.success ? data.subjects : []);
                    setSelectedStudentSubject('');
                });
        }
    }, [selectedStudent]);

    const handleTrackStudentWise = () => {
        navigate(`/admin/student-performance?studentId=${selectedStudent}&subjectId=${selectedStudentSubject}`);
    };

    // View Questions
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    setViewSubjects(data.success ? data.subjects : []);
                    setSelectedViewSubject('');
                    setViewTopics([]);
                    setSelectedViewTopicId('');
                });
        }
    }, [selectedClass, schoolId]);

    useEffect(() => {
        if (selectedClass && selectedViewSubject) {
            let url = `https://clarytix-backend.onrender.com/admin/assigned-topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedViewSubject}`;
            if (selectedSectionId) url += `&sectionId=${selectedSectionId}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setViewTopics(data.success ? data.topics : []);
                    setSelectedViewTopicId('');
                });
        }
    }, [selectedClass, selectedViewSubject, selectedSectionId, schoolId]);

const handleViewQuestions = () => {
    const query = selectedSectionId ? `?sectionId=${selectedSectionId}` : '';
    navigate(`/admin/view-questions/${selectedViewTopicId}${query}`);
};


    // Quiz Count
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    setQuizSubjects(data.success ? data.subjects : []);
                    setSelectedQuizSubject('');
                });
        }
    }, [selectedClass,schoolId]);

    const handleViewQuizCount = () => {
        const query = new URLSearchParams({
            class: selectedClass,
            subjectId: selectedQuizSubject,
        });
        if (countSectionId) query.append('sectionId', countSectionId);
        navigate(`/admin/quiz-count?${query.toString()}`);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />

                {/* Track Topic Wise */}
                <div className="card topic-card">
                    <h3 className="card-title">Track Performance Topic Wise</h3>
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
                                {sections.map(sec => (
                                    <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                                ))}
                            </select>
                        )}
                        <select className="dropdown" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="">Subject</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <select className="dropdown" value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)}>
                            <option value="">Topic</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>
                        <button className="track-btn" disabled={!selectedClass || !selectedSubject || !selectedTopicId} onClick={handleTrackTopicWise}>
                            Track Performance
                        </button>
                    </div>
                </div>

                {/* Track Student Wise */}
                <div className="card student-card">
                    <h3 className="card-title">Track Performance Student Wise</h3>
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
                                {sections.map(sec => (
                                    <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                                ))}
                            </select>
                        )}
                        <select className="dropdown" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                            <option value="">Student</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>{student.username}</option>
                            ))}
                        </select>
                        <select className="dropdown" value={selectedStudentSubject} onChange={(e) => setSelectedStudentSubject(e.target.value)}>
                            <option value="">Subject</option>
                            {studentSubjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <button className="track-btn" disabled={!selectedStudent || !selectedStudentSubject} onClick={handleTrackStudentWise}>
                            Track Performance
                        </button>
                    </div>
                </div>

                {/* View Questions */}
                <div className="card view-questions-card">
                    <h3 className="card-title">View Questions</h3>
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
                                {sections.map(sec => (
                                    <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                                ))}
                            </select>
                        )}
                        <select className="dropdown" value={selectedViewSubject} onChange={(e) => setSelectedViewSubject(e.target.value)}>
                            <option value="">Subject</option>
                            {viewSubjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <select className="dropdown" value={selectedViewTopicId} onChange={(e) => setSelectedViewTopicId(e.target.value)}>
                            <option value="">Topic</option>
                            {viewTopics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>
                        <button className="track-btn" disabled={!selectedViewTopicId} onClick={handleViewQuestions}>
                            View Questions
                        </button>
                    </div>
                </div>

                {/* Quiz Count */}
                <div className="card view-count-card">
                    <h3 className="card-title">Quiz Count</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>
                        {sections.length > 0 && (
                            <select className="dropdown" value={countSectionId} onChange={(e) => setCountSectionId(e.target.value)}>
                                <option value="">Section</option>
                                {sections.map(sec => (
                                    <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                                ))}
                            </select>
                        )}
                        <select className="dropdown" value={selectedQuizSubject} onChange={(e) => setSelectedQuizSubject(e.target.value)}>
                            <option value="">Subject</option>
                            {quizSubjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <button className="track-btn" disabled={!selectedClass || !selectedQuizSubject} onClick={handleViewQuizCount}>
                            View Count
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
