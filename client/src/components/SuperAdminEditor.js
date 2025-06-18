import React, { useEffect, useState } from 'react';
import './SuperAdminEditor.css';

function SuperAdminEditor() {
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('https://clarytix-backend.onrender.com/superadmin/all-topics')
            .then(res => res.json())
            .then(data => {
                if (data.success) setTopics(data.topics);
            });
    }, []);

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
        if (data.success) {
            setMessage('Questions updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('Update failed.');
        }
    };

    return (
        <div className="superadmin-editor-container">
            <h2>SuperAdmin Question Editor</h2>
            <select
                className="dropdown"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
            >
                <option value="">Select Topic</option>
                {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>

            {questions.length > 0 && (
                <div className="table-wrapper">
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
                    <button className="update-btn" onClick={handleUpdate}>Update</button>
                    {message && <div className="message">{message}</div>}
                </div>
            )}
        </div>
    );
}

export default SuperAdminEditor;
