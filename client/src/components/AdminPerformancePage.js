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

    const rawSchoolId = localStorage.getItem('schoolId');
    const schoolId = Number(rawSchoolId);

    // Read sectionId from query params
    const queryParams = new URLSearchParams(window.location.search);
    const sectionId = queryParams.get('sectionId');
    const [sectionName, setSectionName] = useState('');


    useEffect(() => {
        const fetchMetrics = async () => {
            if (!schoolId) {
                alert('Error: No school ID found. Please log in again.');
                return;
            }

            try {
                let url = `https://clarytix-backend.onrender.com/admin/performance-metrics?topicId=${topicId}&schoolId=${schoolId}`;
                if (sectionId) {
                    url += `&sectionId=${sectionId}`;
                }

                const response = await fetch(url);
                const data = await response.json();

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
                console.error('Error fetching performance metrics', error);
                alert('Error connecting to server');
            }
        };

        fetchMetrics();
    }, [topicId, schoolId, sectionId]);

    useEffect(() => {
    const fetchSectionName = async () => {
        if (sectionId) {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/admin/section-name?sectionId=${sectionId}`);
                const data = await response.json();
                if (data.success && data.sectionName) {
                    setSectionName(data.sectionName);
                }
            } catch (err) {
                console.error("Failed to fetch section name", err);
            }
        }
    };

    fetchSectionName();
}, [sectionId]);


    if (!metrics) {
        return <div>Loading metrics...</div>;
    }

    const scoreBuckets = ['0%-20%', '21%-40%', '41%-60%', '61%-80%', '81%-100%'];
    const bucketCounts = metrics.scoreDistribution;

    const leaderboardNames = metrics.leaderboard.map(entry => entry.studentName);
    const leaderboardScores = metrics.leaderboard.map(entry => entry.score);

    function formatSeconds(seconds) {
        if (!seconds || isNaN(seconds)) return '0m 0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    return (
        <div className="admin-container">
            <div className="header-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-large" />
                <h2>Performance Metrics</h2>
                <p>
                    {topicInfo.className}
                    {sectionName ? ` - Section ${sectionName}` : ''}
                    {' - '}
                    {topicInfo.subject} - {topicInfo.topic}
                </p>
            </div>

            <div className="metrics-container">
                <div className="metric-card">
                    <p>Total Unique Responses</p>
                    <h3>{metrics.totalResponses}</h3>
                </div>
                <div className="metric-card">
                    <p>Average Score</p>
                    <h3>{metrics.averageScore}%</h3>
                </div>
                <div className="metric-card">
                    <p>Average Time Taken</p>
                    <h3>{formatSeconds(metrics.averageTimeSpentSeconds)}</h3>
                </div>
                <div className="metric-card">
                    <p>Highest Score</p>
                    <h3>{metrics.highestScore}%</h3>
                </div>
                <div className="metric-card">
                    <p>Lowest Score</p>
                    <h3>{metrics.lowestScore}%</h3>
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
                                label: 'Score (%)',
                                data: leaderboardScores,
                                backgroundColor: 'green'
                            }]
                        }}
                        options={{
                             responsive: true,
        indexAxis: 'x',
        plugins: {
            tooltip: {
                callbacks: {
                    label: context => `${context.parsed.y}%`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `${value}%`
                },
                title: {
                    display: true,
                    text: 'Percentage'
                }
            },
            x: {
                ticks: {
                    autoSkip: false
                }
            }
        }
    }}
/>
                </div>
            </div>

            <div className="back-button-container">
                <button onClick={() => navigate(`/admin/defaulters/${topicId}${sectionId ? `?sectionId=${sectionId}` : ''}`)}>
                    Unattempted List
                </button>
                <button onClick={() => navigate(`/admin/class-details/${topicId}${sectionId ? `?sectionId=${sectionId}` : ''}`)}>
                    Class Details
                </button>
                <button onClick={() => navigate('/admin-dashboard')}>Back to Homepage</button>
            </div>
        </div>
    );
}

export default AdminPerformancePage;
