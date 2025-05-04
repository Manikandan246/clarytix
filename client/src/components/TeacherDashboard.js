import React from 'react';

function TeacherDashboard() {
  const schoolLogo = localStorage.getItem('schoolLogoUrl');
  return (
    <div>
      <img src={schoolLogo} alt="School Logo" style={{ height: '60px' }} />
      <h1>Teacher Dashboard</h1>
    </div>
  );
}

export default TeacherDashboard;
