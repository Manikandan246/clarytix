// Full updated SuperAdminEditor.js with Section Creation
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

    const [newSchoolName, setNewSchoolName] = useState('');
    const [newSchoolLogo, setNewSchoolLogo] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [excelFile, setExcelFile] = useState(null);

    const [schoolCreationMsg, setSchoolCreationMsg] = useState('');
    const [curriculumAssignMsg, setCurriculumAssignMsg] = useState('');
    const [studentUploadMsg, setStudentUploadMsg] = useState('');
    const [sectionAssignMsg, setSectionAssignMsg] = useState('');

    const [selectedSectionClass, setSelectedSectionClass] = useState('');
    const [selectedSectionLetters, setSelectedSectionLetters] = useState([]);

    useEffect(() => {
        fetch('https://clarytix-backend.onrender.com/superadmin/all-topics')
            .then(res => res.json())
            .then(data => { if (data.success) setTopics(data.topics); });

        fetch('https://clarytix-backend.onrender.com/superadmin/all-schools')
            .then(res => res.json())
            .then(data => { if (data.success) setSchools(data.schools); });

        fetch('https://clarytix-backend.onrender.com/superadmin/subjects')
            .then(res => res.json())
            .then(data => setAllSubjects(data));
    }, []);

    const handleSectionAssignment = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/create-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: Number(selectedSchoolId),
                className: selectedSectionClass,
                sectionNames: selectedSectionLetters
            })
        });
        const data = await res.json();
        setSectionAssignMsg(data.success ? 'Sections created successfully!' : 'Section creation failed.');
        if (data.success) {
            setSelectedSectionClass('');
            setSelectedSectionLetters([]);
        }
        setTimeout(() => setSectionAssignMsg(''), 3000);
    };

    return (
        <div className="SuperAdminEditor-container">
            {/* previous sections remain unchanged */}

            {/* Section 4: Section Creation */}
            <div className="sc-section-creator">
                <h2>Create Sections for Class</h2>
                <label>Select School:</label>
                <select value={selectedSchoolId} onChange={e => setSelectedSchoolId(e.target.value)}>
                    <option value="">Select School</option>
                    {schools.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>

                <label>Select Class:</label>
                <select value={selectedSectionClass} onChange={e => setSelectedSectionClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {Array.from({ length: 8 }, (_, i) => `Class ${i + 5}`).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <label>Select Sections (A–J):</label>
                <select multiple value={selectedSectionLetters} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedSectionLetters(selected);
                }}>
                    {['A','B','C','D','E','F','G','H','I','J'].map(letter => (
                        <option key={letter} value={letter}>{letter}</option>
                    ))}
                </select>

                <button onClick={handleSectionAssignment}>Create Sections</button>
                {sectionAssignMsg && <div className="SuperAdminEditor-message">{sectionAssignMsg}</div>}
            </div>
        </div>
    );
}

export default SuperAdminEditor;
