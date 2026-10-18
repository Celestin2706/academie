import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AdminLessons() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/admin/lessons');
      setLessons(res.data);
    } catch {
      setError('Impossible de charger les leçons.');
    }
  }, []);

  useEffect(() => {
    if (user.role === 'admin') load();
  }, [load, user.role]);

  const remove = async (lesson) => {
    if (!window.confirm(`Supprimer la leçon « ${lesson.title} » ?`)) return;
    try {
      await api.delete(`/admin/lessons/${lesson.id}`);
      await load();
    } catch {
      setError('Suppression impossible.');
    }
  };

  if (user.role !== 'admin') {
    return <p className="text-red-600">Accès réservé à l'administrateur.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gérer les leçons</h1>
        <Link
          to="/admin/lessons/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Nouvelle leçon
        </Link>
      </div>

      {error && <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      {lessons.length === 0 && (
        <p className="mt-6 text-slate-500">Aucune leçon pour le moment.</p>
      )}

      <div className="mt-6 space-y-2">
        {lessons.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <div className="font-medium">{l.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                  {l.language.name}
                </span>
                <span className="text-slate-500">
                  {l.level} · position {l.position}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    l.published
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {l.published ? 'publiée' : 'brouillon'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Link to={`/admin/lessons/${l.id}`} className="text-indigo-600 hover:underline">
                Modifier
              </Link>
              <button onClick={() => remove(l)} className="text-red-600 hover:underline">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}