import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Spinner';

const LEVELS = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
};

export default function LanguageDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [done, setDone] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/languages/${slug}`)
      .then((res) => setData(res.data))
      .catch(() => setError('Langage introuvable.'));

    api
      .get('/progress')
      .then((res) => setDone(res.data))
      .catch(() => {});
  }, [slug]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <Spinner />;

  const total = data.lessons.length;
  const finished = data.lessons.filter((l) => done.includes(l.id)).length;

  return (
    <div>
      <Link to="/" className="text-sm text-indigo-600 hover:underline">
        ← Retour
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{data.language.name}</h1>
      <p className="mt-1 text-slate-600">{data.language.description}</p>

      {total > 0 && (
        <div className="mt-4">
          <div className="mb-1 text-sm text-slate-600">
            {finished} / {total} terminée(s)
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-indigo-600"
              style={{ width: `${(finished / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <h2 className="mt-8 mb-3 text-xl font-semibold">Leçons</h2>
      {total === 0 && <p className="text-slate-600">Aucune leçon pour le moment.</p>}

      <div className="space-y-2">
        {data.lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            to={`/languages/${slug}/lessons/${lesson.slug}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-400"
          >
            <span>
              <span className="mr-2 text-slate-400">{index + 1}.</span>
              <span className="font-medium">{lesson.title}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {LEVELS[lesson.level] || lesson.level}
              </span>
              {done.includes(lesson.id) && <span title="Terminée">✅</span>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}