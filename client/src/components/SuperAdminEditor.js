// Full updated code with localized success messages and form reset logic
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

    const [selectedSections, setSelectedSections] = useState([]);
const [sectionCreateMsg, setSectionCreateMsg] = useState('');
const [selectedUploadSchoolId, setSelectedUploadSchoolId] = useState('');

  
    const [chapterClass, setChapterClass] = useState('');
    const [chapterSubjectId, setChapterSubjectId] = useState('');
    const [chapterName, setChapterName] = useState('');
    const [chapterCreateMsg, setChapterCreateMsg] = useState('');


    const [uploadClass, setUploadClass] = useState('');
    const [uploadSubjectId, setUploadSubjectId] = useState('');
    const [uploadChapterId, setUploadChapterId] = useState('');
    const [uploadTopicName, setUploadTopicName] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [chapters, setChapters] = useState([]);


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

    useEffect(() => {
        if (selectedTopicId) {
            fetch(`https://clarytix-backend.onrender.com/superadmin/questions?topicId=${selectedTopicId}`)
                .then(res => res.json())
                .then(data => { if (data.success) setQuestions(data.questions); });
        }
    }, [selectedTopicId]);

     useEffect(() => {
        fetch('https://clarytix-backend.onrender.com/superadmin/subjects')
            .then(res => res.json())
            .then(data => setAllSubjects(data));
    }, []);

        useEffect(() => {
        if (uploadClass && uploadSubjectId) {
            fetch(`https://clarytix-backend.onrender.com/superadmin/chapters?class=${uploadClass}&subjectId=${uploadSubjectId}`)
                .then(res => res.json())
                .then(data => setChapters(data));
        }
    }, [uploadClass, uploadSubjectId]);

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
            prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
        );
    };

    const handleAssignTopicsToSchool = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/assign-topics-to-school', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: Number(selectedSchoolId),
                topicIds: selectedTopicsForSchool.map(Number)
            })
        });
        const data = await res.json();
        setAssignMessage(data.success ? 'Topics assigned successfully!' : 'Assignment failed.');
        setTimeout(() => setAssignMessage(''), 3000);
    };

    const handleSchoolCreation = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/create-school', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newSchoolName, logo_url: newSchoolLogo })
        });
        const data = await res.json();
        setSchoolCreationMsg(data.success ? 'School created successfully!' : 'School creation failed.');
        if (data.success) {
            setNewSchoolName('');
            setNewSchoolLogo('');
        }
        setTimeout(() => setSchoolCreationMsg(''), 3000);
    };

    const handleAssignCurriculum = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/assign-curriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: Number(selectedSchoolId),
                classList: [selectedClass],
                subjectIds: selectedSubjects.map(Number)
            })
        });
        const data = await res.json();
        setCurriculumAssignMsg(data.success ? 'Curriculum assigned successfully!' : 'Assignment failed.');
        if (data.success) {
            setSelectedClass('');
            setSelectedSubjects([]);
        }
        setTimeout(() => setCurriculumAssignMsg(''), 3000);
    };

    const handleExcelUpload = async () => {
        const formData = new FormData();
        formData.append('file', excelFile);
     formData.append('schoolId', selectedUploadSchoolId);


        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/upload-students', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        setStudentUploadMsg(data.success ? 'Students uploaded successfully!' : 'Student upload failed.');
        if (data.success) setExcelFile(null);
        setTimeout(() => setStudentUploadMsg(''), 3000);
    };

    const handleCreateSections = async () => {
    const res = await fetch('https://clarytix-backend.onrender.com/superadmin/create-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            schoolId: Number(selectedSchoolId),
            className: selectedClass,
            sections: selectedSections
        })
    });
    const data = await res.json();
    setSectionCreateMsg(data.success ? 'Sections created successfully!' : 'Section creation failed.');
    if (data.success) setSelectedSections([]);
    setTimeout(() => setSectionCreateMsg(''), 3000);
};

const handleCreateChapter = async () => {
        if (!chapterClass || !chapterSubjectId || !chapterName) return alert("All fields are required");

        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/create-chapter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                class: chapterClass,
                subject_id: chapterSubjectId,
                chapter_name: chapterName
            })
        });
  const data = await res.json();
        if (data.success) {
            setChapterCreateMsg('✅ Chapter created successfully!');
            setChapterClass('');
            setChapterSubjectId('');
            setChapterName('');
        } else {
            setChapterCreateMsg(data.message || '❌ Error creating chapter');
        }
        setTimeout(() => setChapterCreateMsg(''), 3000);
    };

    const handleUploadQuestions = async () => {
        if (!uploadClass || !uploadSubjectId || !uploadChapterId || !uploadTopicName || !uploadFile) {
            return alert("All fields are required for uploading questions");
        }

        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('class', uploadClass);
        formData.append('subject_id', uploadSubjectId);
        formData.append('chapter_id', uploadChapterId);
        formData.append('topic_name', uploadTopicName);

        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/upload-questions', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            setUploadMessage('✅ Questions uploaded and topic created successfully!');
            setUploadClass('');
            setUploadSubjectId('');
            setUploadChapterId('');
            setUploadTopicName('');
            setUploadFile(null);
        } else {
            setUploadMessage(data.message || '❌ Upload failed');
        }
        setTimeout(() => setUploadMessage(''), 3000);
    };



    return (
        <div className="SuperAdminEditor-container">
            {/* Section 1: Question Editor */}
            <h2>SuperAdmin Question Editor</h2>
            <select className="SuperAdminEditor-dropdown" value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)}>
                <option value="">Select Topic</option>
                {topics.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>

            {questions.length > 0 && (
                <div className="SuperAdminEditor-table-wrapper">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Question</th><th>A</th><th>B</th><th>C</th><th>D</th><th>Correct</th><th>Explanation</th></tr>
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
                <select className="SuperAdminEditor-dropdown" value={selectedSchoolId} onChange={(e) => { setSelectedSchoolId(e.target.value); setSelectedTopicsForSchool([]); }}>
                    <option value="">Select School</option>
                    {schools.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
                {selectedSchoolId && (
                    <div className="SuperAdminEditor-checkbox-grid">
                        {topics.map(topic => (
                            <label key={topic.id}>
                                <input type="checkbox" checked={selectedTopicsForSchool.includes(topic.id)} onChange={() => handleTopicCheckbox(topic.id)} />
                                {topic.name}
                            </label>
                        ))}
                    </div>
                )}
                <button className="SuperAdminEditor-update-btn" onClick={handleAssignTopicsToSchool}>Assign Topics</button>
                {assignMessage && <div className="SuperAdminEditor-message">{assignMessage}</div>}
            </div>

            {/* Section 3: School Onboarding */}
            <div className="sc-onboarding-section">
                <h2>School Onboarding</h2>

                <div>
                    <input placeholder="School Name" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} />
                    <input placeholder="School Logo URL" value={newSchoolLogo} onChange={e => setNewSchoolLogo(e.target.value)} />
                    <button onClick={handleSchoolCreation}>Create School</button>
                    {schoolCreationMsg && <div className="SuperAdminEditor-message">{schoolCreationMsg}</div>}
                </div>

                <div>
                    <h4>Assign Curriculum</h4>
                    <label>Select School:</label>
                    <select value={selectedSchoolId} onChange={e => setSelectedSchoolId(e.target.value)}>
                        <option value="">Select School</option>
                        {schools.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>

                    <label>Select Class:</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        <option value="">Select Class</option>
                        {Array.from({ length: 8 }, (_, i) => `Class ${i + 5}`).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <label>Select Subjects:</label>
                    <select multiple value={selectedSubjects} onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => Number(option.value));
                        setSelectedSubjects(options);
                    }}>
                        {allSubjects.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>

                    <button onClick={handleAssignCurriculum}>Assign Subjects</button>
                    {curriculumAssignMsg && <div className="SuperAdminEditor-message">{curriculumAssignMsg}</div>}
                </div>

                {/* Section 4: Create Sections */}
<div>
    <h4>Create Sections</h4>
    <label>Select School:</label>
    <select value={selectedSchoolId} onChange={e => setSelectedSchoolId(e.target.value)}>
        <option value="">Select School</option>
        {schools.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
    </select>

    <label>Select Class:</label>
    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
        <option value="">Select Class</option>
        {Array.from({ length: 8 }, (_, i) => `Class ${i + 5}`).map(c => (
            <option key={c} value={c}>{c}</option>
        ))}
    </select>

    <label>Select Sections:</label>
    <select multiple value={selectedSections} onChange={(e) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedSections(options);
    }}>
        {['A','B','C','D','E','F','G','H','I','J'].map(section => (
            <option key={section} value={section}>{section}</option>
        ))}
    </select>

    <button onClick={handleCreateSections}>Create Sections</button>
    {sectionCreateMsg && <div className="SuperAdminEditor-message">{sectionCreateMsg}</div>}
</div>


                <div>
                    <h4>Upload Student Data (Excel)</h4>
                    <label>Select School:</label>
<select value={selectedUploadSchoolId} onChange={e => setSelectedUploadSchoolId(e.target.value)}>
    <option value="">Select School</option>
    {schools.map(s => (
        <option key={s.id} value={s.id}>{s.name}</option>
    ))}
</select>
                    <input type="file" accept=".xlsx, .csv" onChange={e => setExcelFile(e.target.files[0])} />
                    <button onClick={handleExcelUpload}>Upload Students</button>
                    {studentUploadMsg && <div className="SuperAdminEditor-message">{studentUploadMsg}</div>}
                </div>
            </div>
            <div><h2>📘 Create Chapter</h2>

            <div className="chapter-form-grid">
                <select value={chapterClass} onChange={e => setChapterClass(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Class</option>
                    {[5,6,7,8,9,10,11,12].map(cls => (
                        <option key={cls} value={`Class ${cls}`}>{`Class ${cls}`}</option>
                    ))}
                </select>

                <select value={chapterSubjectId} onChange={e => setChapterSubjectId(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Subject</option>
                    {allSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter Chapter Name"
                    value={chapterName}
                    onChange={e => setChapterName(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>

            <button onClick={handleCreateChapter} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Chapter
            </button>

            {chapterCreateMsg && (
                <div className="mt-2 text-green-600 font-semibold">{chapterCreateMsg}</div>
            )}


</div>

<div><h2>📥 Upload Questions with Topic</h2>
            <div className="upload-form-grid">
                <select value={uploadClass} onChange={e => setUploadClass(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Class</option>
                    {[5,6,7,8,9,10,11,12].map(cls => (
                        <option key={cls} value={`Class ${cls}`}>{`Class ${cls}`}</option>
                    ))}
                </select>

                <select value={uploadSubjectId} onChange={e => setUploadSubjectId(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Subject</option>
                    {allSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>

                <select value={uploadChapterId} onChange={e => setUploadChapterId(e.target.value)} className="p-2 border rounded">
                    <option value="">Select Chapter</option>
                    {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.chapter_name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter Topic Name"
                    value={uploadTopicName}
                    onChange={e => setUploadTopicName(e.target.value)}
                    className="p-2 border rounded"
                />

                <input
                    type="file"
                    accept=".xlsx, .csv"
                    onChange={e => setUploadFile(e.target.files[0])}
                    className="p-2"
                />
            </div>

            <button onClick={handleUploadQuestions} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Upload Questions
            </button>

            {uploadMessage && (
                <div className="mt-2 text-green-600 font-semibold">{uploadMessage}</div>
            )}</div>
            
        </div>
    );
}

export default SuperAdminEditor;
