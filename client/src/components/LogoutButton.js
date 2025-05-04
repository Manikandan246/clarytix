import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <button 
            style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',  // blue
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}  // darker on hover
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}

export default LogoutButton;
