import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main
        key={location.pathname}
        className="mx-auto max-w-4xl animate-fade-in px-4 py-8 motion-reduce:animate-none"
      >
        <Outlet />
      </main>
    </div>
  );
}