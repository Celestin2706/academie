import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { SkeletonCard } from '../components/Skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/languages')
      .then((res) => setLanguages(res.data))
      .catch(() => setError('Impossible de charger les langages.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Bonjour {user.name} 👋</h1>
      <p className="mt-1 text-slate-600">
        Choisis un langage pour commencer à apprendre.
      </p>

      {error && (
        <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {languages.map((lang) => (
          <Link
            key={lang.id}
            to={`/languages/${lang.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-400 hover:shadow"
          >
            <h2 className="text-xl font-semibold text-indigo-700">{lang.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{lang.description}</p>
            <p className="mt-3 text-xs font-medium text-slate-500">
              {lang.lessons_count} leçon(s)
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}