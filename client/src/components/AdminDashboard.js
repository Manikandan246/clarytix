import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const navigate = useNavigate();

    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [studentSubjects, setStudentSubjects] = useState([]);
    const [selectedStudentSubject, setSelectedStudentSubject] = useState('');

    const [quizSubjects, setQuizSubjects] = useState([]);
    const [selectedQuizSubject, setSelectedQuizSubject] = useState('');

    // --- View Questions ---
    const [viewSubjects, setViewSubjects] = useState([]);
    const [selectedViewSubject, setSelectedViewSubject] = useState('');
    const [viewTopics, setViewTopics] = useState([]);
    const [selectedViewTopicId, setSelectedViewTopicId] = useState('');

    // --- Track Performance Topic Wise ---
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

 // Replace this existing useEffect for topics
useEffect(() => {
    if (selectedClass && selectedSubject) {
        fetch(`https://clarytix-backend.onrender.com/admin/assigned-topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedSubject}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setTopics(data.topics);
                else setTopics([]);
                setSelectedTopicId('');
            });
    }
}, [selectedClass, selectedSubject, schoolId]);


    const handleTrackTopicWise = () => {
        navigate(`/admin/performance/${selectedTopicId}`);
    };

    // --- Track Performance Student Wise ---
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/students?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setStudents(data.students);
                    else setStudents([]);
                    setSelectedStudent('');
                    setStudentSubjects([]);
                    setSelectedStudentSubject('');
                });
        }
    }, [selectedClass, schoolId]);

    useEffect(() => {
        if (selectedStudent) {
            fetch(`https://clarytix-backend.onrender.com/admin/student-subjects?studentId=${selectedStudent}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setStudentSubjects(data.subjects);
                    else setStudentSubjects([]);
                    setSelectedStudentSubject('');
                });
        }
    }, [selectedStudent]);

    const handleTrackStudentWise = () => {
        navigate(`/admin/student-performance?studentId=${selectedStudent}&subjectId=${selectedStudentSubject}`);
    };

    // --- View Questions ---
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setViewSubjects(data.subjects);
                    else setViewSubjects([]);
                    setSelectedViewSubject('');
                    setViewTopics([]);
                    setSelectedViewTopicId('');
                });
        }
    }, [selectedClass, schoolId]);

    useEffect(() => {
        if (selectedClass && selectedViewSubject) {
            fetch(`https://clarytix-backend.onrender.com/admin/assigned-topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedViewSubject}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setViewTopics(data.topics);
                    else setViewTopics([]);
                    setSelectedViewTopicId('');
                });
        }
    }, [selectedClass, selectedViewSubject, schoolId]);

    const handleViewQuestions = () => {
        navigate(`/admin/view-questions/${selectedViewTopicId}`);
    };

     // Fetch subjects for the Quiz Count card
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setQuizSubjects(data.subjects);
                    else setQuizSubjects([]);
                    setSelectedQuizSubject('');
                });
        }
    }, [selectedClass, schoolId]);

    const handleViewQuizCount = () => {
        navigate(`/admin/quiz-count?class=${selectedClass}&subjectId=${selectedQuizSubject}`);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />

                {/* Card 1: Topic Wise */}
                <div className="card topic-card">
                    <h3 className="card-title">Track Performance Topic Wise</h3>
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
                            onClick={handleTrackTopicWise}
                        >
                            Track Performance
                        </button>
                    </div>
                </div>

                {/* Card 2: Student Wise */}
                <div className="card student-card">
                    <h3 className="card-title">Track Performance Student Wise</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            disabled={!selectedClass}
                        >
                            <option value="">Student</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>{student.username}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedStudentSubject}
                            onChange={(e) => setSelectedStudentSubject(e.target.value)}
                            disabled={!selectedStudent}
                        >
                            <option value="">Subject</option>
                            {studentSubjects.map(subj => (
                                <option key={subj.id} value={subj.id}>{subj.name}</option>
                            ))}
                        </select>

                        <button
                            className="track-btn"
                            disabled={!selectedStudent || !selectedStudentSubject}
                            onClick={handleTrackStudentWise}
                        >
                            Track Performance
                        </button>
                    </div>
                </div>

                {/* Card 3: View Questions */}
                <div className="card view-questions-card">
                    <h3 className="card-title">View Questions</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedViewSubject}
                            onChange={(e) => setSelectedViewSubject(e.target.value)}
                            disabled={!selectedClass}
                        >
                            <option value="">Subject</option>
                            {viewSubjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedViewTopicId}
                            onChange={(e) => setSelectedViewTopicId(e.target.value)}
                            disabled={!selectedViewSubject}
                        >
                            <option value="">Topic</option>
                            {viewTopics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>

                        <button
                            className="track-btn"
                            disabled={!selectedClass || !selectedViewSubject || !selectedViewTopicId}
                            onClick={handleViewQuestions}
                        >
                            View Questions
                        </button>
                    </div>
                </div>

      

                {/* -- Quiz Count Card -- */}
                <div className="card view-count-card">
                    <h3 className="card-title">Quiz Count</h3>
                    <div className="dropdown-row">
                        <select
                            className="dropdown"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={selectedQuizSubject}
                            onChange={(e) => setSelectedQuizSubject(e.target.value)}
                            disabled={!selectedClass}
                        >
                            <option value="">Subject</option>
                            {quizSubjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>

                        <button
                           className="track-btn"
                            disabled={!selectedClass || !selectedQuizSubject}
                            onClick={handleViewQuizCount}
                        >
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
