import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import QuizContainer from './components/QuizContainer';
import AdminPerformancePage from './components/AdminPerformancePage';
import OldQuizDashboard from './components/OldQuizDashboard'; // ✅ Import this
import StudentPerformance from './components/StudentPerformance';

function WrappedQuizContainer() {
  const { topicId } = useParams();
  return <QuizContainer topicId={topicId} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/quiz/:topicId" element={<WrappedQuizContainer />} />
        <Route path="/admin/performance/:topicId" element={<AdminPerformancePage />} />
        <Route path="/old-quizzes" element={<OldQuizDashboard />} /> {/* ✅ Add this */}
        <Route path="/admin/student-performance" element={<StudentPerformance />} />
      </Routes>
    </Router>
  );
}

export default App;
