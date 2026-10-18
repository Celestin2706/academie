import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-800 text-white'
      : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-600 shadow">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-1 px-4 py-3">
        <span className="mr-4 text-lg font-bold text-white">Apprendre le code</span>

        <NavLink to="/" end className={linkClass}>
          Accueil
        </NavLink>
        <NavLink to="/playground" className={linkClass}>
          Éditeur
        </NavLink>
        <NavLink to="/chat" className={linkClass}>
          Discuter
        </NavLink>

        {user.role === 'admin' && (
          <>
            <NavLink to="/admin/inbox" className={linkClass}>
              Messages
            </NavLink>
            <NavLink to="/admin/lessons" className={linkClass}>
              Leçons
            </NavLink>
          </>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-indigo-100 sm:inline">{user.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
}