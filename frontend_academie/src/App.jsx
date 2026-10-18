import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LanguageDetail from './pages/LanguageDetail';
import LessonPage from './pages/LessonPage';
import Playground from './pages/Playground';
import Chat from './pages/Chat';
import AdminInbox from './pages/AdminInbox';
import AdminConversation from './pages/AdminConversation';
import AdminLessons from './pages/AdminLessons';
import AdminLessonForm from './pages/AdminLessonForm';
import Spinner from './components/Spinner';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/languages/:slug" element={<LanguageDetail />} />
        <Route path="/languages/:slug/lessons/:lessonSlug" element={<LessonPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin/inbox" element={<AdminInbox />} />
        <Route path="/admin/chat/:id" element={<AdminConversation />} />
        <Route path="/admin/lessons" element={<AdminLessons />} />
        <Route path="/admin/lessons/new" element={<AdminLessonForm />} />
        <Route path="/admin/lessons/:id" element={<AdminLessonForm />} />
      </Route>
    </Routes>
  );
}