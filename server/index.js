const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS (must be at the top!)
app.use(cors({
    origin: ['http://localhost:3000', 'https://clarytix.netlify.app','https://clarytix.org', 'https://www.clarytix.org','https://clary.netlify.app']
}));


app.use(express.json()); // to parse JSON bodies

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const upload = multer({ dest: 'uploads/' });

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await pool.connect();

        const result = await client.query(
            'SELECT u.id, u.username, u.role, u.school_id, s.logo_url FROM users u JOIN schools s ON u.school_id = s.id WHERE u.username = $1 AND u.password = $2',
            [username, password]
        );

        client.release();

        if (result.rows.length === 1) {
            const user = result.rows[0];
            res.json({
                success: true,
                userId: user.id,
                username: user.username, 
                role: user.role,
                schoolId: user.school_id,
                schoolLogoUrl: user.logo_url,
            });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin upload route
app.post('/admin/upload-questions', upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const metadataSheet = workbook.Sheets['Metadata'];
        const questionsSheet = workbook.Sheets['Questions'];

        const metadata = xlsx.utils.sheet_to_json(metadataSheet, { header: 1 });
        const metadataObj = {};
        metadata.forEach(([field, value]) => {
            metadataObj[field.trim().toLowerCase()] = value;
        });

        const subjectName = metadataObj['subject'];
        const className = metadataObj['class'];
        const topicName = metadataObj['topic'];

        const client = await pool.connect();

        const subjectResult = await client.query(
            'INSERT INTO subjects (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
            [subjectName]
        );
        const subjectId = subjectResult.rows[0].id;

        const topicResult = await client.query(
            `INSERT INTO topics (subject_id, name, class)
             VALUES ($1, $2, $3)
             ON CONFLICT (subject_id, name, class) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [subjectId, topicName, className]
        );
        const topicId = topicResult.rows[0].id;

        const questions = xlsx.utils.sheet_to_json(questionsSheet);
        for (const q of questions) {
            await client.query(
                `INSERT INTO questions (topic_id, class, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    topicId,
                    className,
                    q['Question Text'],
                    q['Option A'],
                    q['Option B'],
                    q['Option C'],
                    q['Option D'],
                    q['Correct Answer'],
                    q['Explanation']
                ]
            );
        }

        client.release();
        res.json({ success: true, message: 'Questions uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error uploading questions.' });
    }
});

app.get('/quiz/questions', async (req, res) => {
    const { topicId } = req.query;

    try {
        const client = await pool.connect();

        const questionResult = await client.query(
            `SELECT id, question_text, option_a, option_b, option_c, option_d
             FROM questions
             WHERE topic_id = $1`,
            [topicId]
        );

        const metaResult = await client.query(
            `SELECT s.name AS subject, t.name AS topic
             FROM topics t
             JOIN subjects s ON t.subject_id = s.id
             WHERE t.id = $1`,
            [topicId]
        );

        client.release();

        if (metaResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Subject or topic not found' });
        }

        const { subject, topic } = metaResult.rows[0];

        res.json({
            success: true,
            subject,
            topic,
            questions: questionResult.rows
        });

    } catch (err) {
        console.error('Fetch quiz questions error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/quiz/submit', async (req, res) => {
    const { userId, topicId, answers } = req.body;

    try {
        const client = await pool.connect();

        const correctAnswersResult = await client.query(
            `SELECT id, question_text, correct_answer, explanation
             FROM questions
             WHERE topic_id = $1`,
            [topicId]
        );

        const attemptResult = await client.query(
            `SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt
             FROM quiz_attempts
             WHERE user_id = $1 AND topic_id = $2`,
            [userId, topicId]
        );
        const attemptNumber = attemptResult.rows[0].next_attempt;

        const correctAnswersMap = {};
        correctAnswersResult.rows.forEach(q => {
            correctAnswersMap[q.id] = {
                correctAnswer: q.correct_answer,
                explanation: q.explanation,
                questionText: q.question_text
            };
        });

        let score = 0;
        const detailedResults = answers.map(({ questionId, selectedOption }) => {
            const correctAnswer = correctAnswersMap[questionId].correctAnswer;
            const explanation = correctAnswersMap[questionId].explanation;
            const questionText = correctAnswersMap[questionId].questionText;
            const isCorrect = selectedOption === correctAnswer;

            if (isCorrect) score += 10;

            return {
                questionId,
                questionText,
                selectedOption,
                correct: isCorrect,
                correctAnswer,
                explanation
            };
        });

        const attemptInsert = await client.query(
            `INSERT INTO quiz_attempts (user_id, topic_id, score, attempt_number)
             VALUES ($1, $2, $3, $4)
             RETURNING attempt_id`,
            [userId, topicId, score, attemptNumber]
        );
        const attemptId = attemptInsert.rows[0].attempt_id;

        for (const result of detailedResults) {
            await client.query(
                `INSERT INTO quiz_attempt_responses (attempt_id, question_id, selected_option, is_correct)
                 VALUES ($1, $2, $3, $4)`,
                [attemptId, result.questionId, result.selectedOption, result.correct]
            );
        }

        client.release();

        res.json({
            success: true,
            results: detailedResults
        });

    } catch (err) {
        console.error('Submit quiz error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/student/quizzes', async (req, res) => {
    const { studentId } = req.query;

    try {
        const client = await pool.connect();

        // First, fetch the student's class
        const studentResult = await client.query(
            'SELECT class FROM students WHERE user_id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            console.log(`No student found for user_id: ${studentId}`);
            client.release();
            return res.json({ success: true, availableQuizzes: [] });
        }

        const studentClass = studentResult.rows[0].class;
        console.log(`Student ${studentId} is in class: ${studentClass}`);

        // Then, fetch the quizzes matching that class
        const quizResult = await client.query(
            `SELECT DISTINCT q.topic_id, s.name AS subject, t.name AS topic
             FROM questions q
             JOIN topics t ON q.topic_id = t.id
             JOIN subjects s ON t.subject_id = s.id
             WHERE q.class = $1`,
            [studentClass]
        );

        

        client.release();

        res.json({ success: true, availableQuizzes: quizResult.rows });
    } catch (err) {
        console.error('Fetch quizzes error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/admin/quizzes', async (req, res) => {
    const { schoolId } = req.query;

    try {
        const client = await pool.connect();

        const quizResult = await client.query(
            `SELECT q.class, s.name AS subject, t.name AS topic, t.id AS topic_id
             FROM questions q
             JOIN topics t ON q.topic_id = t.id
             JOIN subjects s ON t.subject_id = s.id
             GROUP BY q.class, s.name, t.name, t.id`
        );

        client.release();

        res.json({ success: true, availableQuizzes: quizResult.rows });
    } catch (err) {
        console.error('Fetch admin quizzes error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/admin/performance-metrics', async (req, res) => {
    let { topicId, schoolId } = req.query;

    // Convert to integers safely
    topicId = parseInt(topicId);
    schoolId = parseInt(schoolId);

    if (isNaN(topicId) || isNaN(schoolId)) {
        return res.status(400).json({ success: false, message: 'Invalid topicId or schoolId' });
    }

    try {
        const client = await pool.connect();

        const topicInfoResult = await client.query(
            `SELECT t.name AS topic, s.name AS subject, q.class AS class
             FROM topics t
             JOIN subjects s ON t.subject_id = s.id
             JOIN questions q ON q.topic_id = t.id
             WHERE t.id = $1
             LIMIT 1`,
            [topicId]
        );

        if (topicInfoResult.rows.length === 0) {
            client.release();
            return res.status(404).json({ success: false, message: 'Topic not found' });
        }

        const { topic, subject, class: className } = topicInfoResult.rows[0];

        const result = await client.query(
           `SELECT qa.user_id, u.username, qa.score
             FROM quiz_attempts qa
             JOIN users u ON qa.user_id = u.id
             WHERE qa.topic_id = $1 AND qa.attempt_number = 1 AND u.school_id = $2`,
            [topicId, schoolId]
        );

        const attempts = result.rows;

        if (attempts.length === 0) {
            client.release();
            return res.json({
                success: true,
                className,
                subject,
                topic,
                totalResponses: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                scoreDistribution: [0, 0, 0, 0, 0],
                leaderboard: []
            });
        }

        const scores = attempts.map(a => a.score);
        const totalResponses = attempts.length;
        const averageScore = (scores.reduce((sum, s) => sum + s, 0) / totalResponses).toFixed(1);
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);

        const distribution = [0, 0, 0, 0, 0];
        scores.forEach(score => {
            if (score <= 20) distribution[0]++;
            else if (score <= 40) distribution[1]++;
            else if (score <= 60) distribution[2]++;
            else if (score <= 80) distribution[3]++;
            else distribution[4]++;
        });

        const leaderboard = attempts
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(a => ({
                studentName: a.username,
                score: a.score
            }));

        client.release();

        res.json({
            success: true,
            className,
            subject,
            topic,
            totalResponses,
            averageScore,
            highestScore,
            lowestScore,
            scoreDistribution: distribution,
            leaderboard
        });
    } catch (err) {
        console.error('Fetch performance metrics error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.get('/student/old-quizzes', async (req, res) => {
    const { studentId } = req.query;

    try {
        const client = await pool.connect();

        const result = await client.query(
            `SELECT DISTINCT s.name AS subject, t.name AS topic, t.id AS topic_id
             FROM quiz_attempts qa
             JOIN topics t ON qa.topic_id = t.id
             JOIN subjects s ON t.subject_id = s.id
             WHERE qa.user_id = $1 AND qa.attempt_number = 1
             ORDER BY qa.attempt_id DESC`,
            [studentId]
        );

        client.release();
        res.json({ success: true, oldQuizzes: result.rows });

    } catch (err) {
        console.error('Fetch old quizzes error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



// =====================
// Serve React static files (client/build) in production
// =====================


// =====================
// Start server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

