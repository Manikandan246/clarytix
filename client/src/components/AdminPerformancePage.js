import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminPerformancePage.css';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function AdminPerformancePage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [topicInfo, setTopicInfo] = useState({});
    const schoolLogo = localStorage.getItem('schoolLogoUrl');

    // NEW: Check raw schoolId from localStorage
    const rawSchoolId = localStorage.getItem('schoolId');
    console.log('Raw schoolId from localStorage:', rawSchoolId);

    const schoolId = Number(rawSchoolId);
    console.log('Final schoolId being sent:', schoolId);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!rawSchoolId) {
                console.error('❌ No schoolId found in localStorage! Cannot fetch metrics.');
                alert('Error: No school ID found. Please log in again.');
                return;
            }

            try {
                console.log('✅ Sending topicId:', topicId, 'schoolId:', schoolId);

                const response = await fetch(`http://localhost:5000/admin/performance-metrics?topicId=${topicId}&schoolId=${schoolId}`);
                const data = await response.json();
                console.log('✅ Received metrics response:', data);

                if (data.success) {
                    setMetrics(data);
                    setTopicInfo({
                        className: data.className || 'Class X',
                        subject: data.subject || 'Subject Name',
                        topic: data.topic || 'Topic Name'
                    });
                } else {
                    alert('Failed to load performance metrics');
                }
            } catch (error) {
                console.error('❌ Error fetching performance metrics', error);
                alert('Error connecting to server');
            }
        };
        fetchMetrics();
    }, [topicId, rawSchoolId, schoolId]);

    if (!metrics) {
        return <div>Loading metrics...</div>;
    }

    const scoreBuckets = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    const bucketCounts = metrics.scoreDistribution;

    const leaderboardNames = metrics.leaderboard.map(entry => entry.studentName);
    const leaderboardScores = metrics.leaderboard.map(entry => entry.score);

    return (
        <div className="admin-container">
            <div className="header-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
                <h2>Performance Metrics</h2>
                <p>{topicInfo.className} - {topicInfo.subject} - {topicInfo.topic}</p>
            </div>

            <div className="metrics-container">
                <div className="metric-card">
                    <p>Total Unique Responses</p>
                    <h3>{metrics.totalResponses}</h3>
                </div>
                <div className="metric-card">
                    <p>Average Score</p>
                    <h3>{metrics.averageScore}</h3>
                </div>
                <div className="metric-card">
                    <p>Highest Score</p>
                    <h3>{metrics.highestScore}</h3>
                </div>
                <div className="metric-card">
                    <p>Lowest Score</p>
                    <h3>{metrics.lowestScore}</h3>
                </div>
            </div>

            <div className="charts-row">
                <div className="chart-card">
                    <h3>Score Distribution</h3>
                    <Bar
                        data={{
                            labels: scoreBuckets,
                            datasets: [{
                                label: 'Count',
                                data: bucketCounts,
                                backgroundColor: 'blue'
                            }]
                        }}
                        options={{ responsive: true }}
                    />
                </div>

                <div className="chart-card">
                    <h3>Leaderboard</h3>
                    <Bar
                        data={{
                            labels: leaderboardNames,
                            datasets: [{
                                label: 'Score',
                                data: leaderboardScores,
                                backgroundColor: 'green'
                            }]
                        }}
                        options={{
                            responsive: true,
                            indexAxis: 'x',
                            scales: { x: { ticks: { autoSkip: false } } }
                        }}
                    />
                </div>
            </div>

            <div className="back-button-container">
                <button onClick={() => navigate('/admin-dashboard')}>Back to Homepage</button>
            </div>
        </div>
    );
}

export default AdminPerformancePage;
