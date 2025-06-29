import React, { useEffect, useState } from 'react';
import './SuperAdminEditor.css';

function SuperAdminEditor() {
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState('');

    const [schools, setSchools] = useState([]);
    const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
    const [assignMessage, setAssignMessage] = useState('');

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

    useEffect(() => {
        if (selectedTopicId) {
            fetch(`https://clarytix-backend.onrender.com/superadmin/questions?topicId=${selectedTopicId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setQuestions(data.questions);
                });

            // Optionally fetch already assigned schools for that topic
            fetch(`https://clarytix-backend.onrender.com/superadmin/topic-schools?topicId=${selectedTopicId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSelectedSchoolIds(data.schoolIds);
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

    const handleAssignTopics = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/assign-topic-to-schools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topicId: selectedTopicId, schoolIds: selectedSchoolIds })
        });
        const data = await res.json();
        setAssignMessage(data.success ? 'Topic assigned to schools successfully!' : 'Assignment failed.');
        setTimeout(() => setAssignMessage(''), 3000);
    };

    const handleSchoolCheckbox = (schoolId) => {
        setSelectedSchoolIds(prev =>
            prev.includes(schoolId)
                ? prev.filter(id => id !== schoolId)
                : [...prev, schoolId]
        );
    };

    return (
        <div className="SuperAdminEditor-container">
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

            {selectedTopicId && (
                <div className="SuperAdminEditor-topic-assignment">
                    <h3>Assign Topic to Schools</h3>
                    <div className="SuperAdminEditor-school-checkbox-list">
                        {schools.map(s => (
                            <label key={s.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedSchoolIds.includes(s.id)}
                                    onChange={() => handleSchoolCheckbox(s.id)}
                                />
                                {s.name}
                            </label>
                        ))}
                    </div>
                    <button className="SuperAdminEditor-update-btn" onClick={handleAssignTopics}>
                        Assign to Selected Schools
                    </button>
                    {assignMessage && <div className="SuperAdminEditor-message">{assignMessage}</div>}
                </div>
            )}
        </div>
    );
}

export default SuperAdminEditor;
