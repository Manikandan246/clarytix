import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://clarytix-backend.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ 
    username: username.trim(), 
    password 
}),

            });
            const data = await response.json();
            if (data.success) {
                // Store info in localStorage for use across pages
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('schoolLogoUrl', data.schoolLogoUrl);
                localStorage.setItem('username', data.username);
                localStorage.setItem('schoolId', data.schoolId);
                // Redirect based on role
                if (data.role === 'student') {
                    navigate('/student-dashboard');
                } else if (data.role === 'teacher') {
                    navigate('/teacher-dashboard');
                } else if (data.role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (data.role === 'superadmin') {
        navigate('/superadmin-editor');
    }
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Login error', error);
            alert('Error connecting to server');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-banner">
                    <img src="/banner.png" alt="ClarytiX Banner" className="login-banner-image" />
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
