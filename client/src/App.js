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
import DefaultersPage from './components/DefaultersPage';
import ViewQuestions from './components/ViewQuestions';


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
        <Route path="/admin/defaulters/:topicId" element={<DefaultersPage />} />
        <Route path="/admin/view-questions/:topicId" element={<ViewQuestions />} />

      </Routes>
    </Router>
  );
}

export default App;
