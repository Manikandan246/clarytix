import React, { useEffect, useState } from 'react';
import './SuperAdminEditor.css';

function SuperAdminEditor() {
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState('');

    const [schools, setSchools] = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    const [selectedTopicsForSchool, setSelectedTopicsForSchool] = useState([]);
    const [assignMessage, setAssignMessage] = useState('');

    // Load all topics and schools initially
    useEffect(() => {
        fetch('https://clarytix-backend.onrender.com/superadmin/all-topics')
            .then(res => res.json())
            .then(data => {
                if (data.success) setTopics(data.topics);
            });

        fetch('https://clarytix-backend.onrender.com/superadmin/all-schools')
            .then(res => res.json())
            .then(data => {
                if (data.success) setSchools(data.schools);
            });
    }, []);

    // Load questions when a topic is selected
    useEffect(() => {
        if (selectedTopicId) {
            fetch(`https://clarytix-backend.onrender.com/superadmin/questions?topicId=${selectedTopicId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setQuestions(data.questions);
                });
        }
    }, [selectedTopicId]);

    const handleChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleUpdate = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/update-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions })
        });
        const data = await res.json();
        setMessage(data.success ? 'Questions updated successfully!' : 'Update failed.');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleTopicCheckbox = (topicId) => {
        setSelectedTopicsForSchool(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleAssignTopicsToSchool = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/assign-topics-to-school', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: selectedSchoolId,
                topicIds: selectedTopicsForSchool
            })
        });

        const data = await res.json();
        setAssignMessage(data.success ? 'Topics assigned to school successfully!' : 'Assignment failed.');
        setTimeout(() => setAssignMessage(''), 3000);
    };

    return (
        <div className="SuperAdminEditor-container">
            {/* Section 1: Question Editor */}
            <h2>SuperAdmin Question Editor</h2>
            <select
                className="SuperAdminEditor-dropdown"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
            >
                <option value="">Select Topic</option>
                {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>

            {questions.length > 0 && (
                <div className="SuperAdminEditor-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>Correct</th>
                                <th>Explanation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q, i) => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td><input value={q.question_text} onChange={e => handleChange(i, 'question_text', e.target.value)} /></td>
                                    <td><input value={q.option_a} onChange={e => handleChange(i, 'option_a', e.target.value)} /></td>
                                    <td><input value={q.option_b} onChange={e => handleChange(i, 'option_b', e.target.value)} /></td>
                                    <td><input value={q.option_c} onChange={e => handleChange(i, 'option_c', e.target.value)} /></td>
                                    <td><input value={q.option_d} onChange={e => handleChange(i, 'option_d', e.target.value)} /></td>
                                    <td><input value={q.correct_answer} onChange={e => handleChange(i, 'correct_answer', e.target.value.toUpperCase())} /></td>
                                    <td><input value={q.explanation} onChange={e => handleChange(i, 'explanation', e.target.value)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="SuperAdminEditor-update-btn" onClick={handleUpdate}>Update</button>
                    {message && <div className="SuperAdminEditor-message">{message}</div>}
                </div>
            )}

            {/* Section 2: Topic Assignment */}
            <div className="SuperAdminEditor-assign-section">
                <h2>Assign Topics to School</h2>
                <select
                    className="SuperAdminEditor-dropdown"
                    value={selectedSchoolId}
                    onChange={(e) => {
                        setSelectedSchoolId(e.target.value);
                        setSelectedTopicsForSchool([]); // Reset
                    }}
                >
                    <option value="">Select School</option>
                    {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                {selectedSchoolId && (
                    <div className="SuperAdminEditor-checkbox-grid">
                        {topics.map(topic => (
                            <label key={topic.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedTopicsForSchool.includes(topic.id)}
                                    onChange={() => handleTopicCheckbox(topic.id)}
                                />
                                {topic.name}
                            </label>
                        ))}
                    </div>
                )}

                <button className="SuperAdminEditor-update-btn" onClick={handleAssignTopicsToSchool}>
                    Assign Topics
                </button>
                {assignMessage && <div className="SuperAdminEditor-message">{assignMessage}</div>}
            </div>
        </div>
    );
}

export default SuperAdminEditor;
