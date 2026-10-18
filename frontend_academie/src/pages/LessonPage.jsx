import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import api from '../api';
import Spinner from '../components/Spinner';

const MONACO = { python: 'python', javascript: 'javascript' };

const buttonClass =
  'rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50';

export default function LessonPage() {
  const { slug, lessonSlug } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [checkError, setCheckError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    api
      .get(`/languages/${slug}/lessons/${lessonSlug}`)
      .then((res) => {
        setLesson(res.data);
        setCode(res.data.exercise_starter || '');
        setResult(null);
        setCheckError('');
      })
      .catch(() => setError('Leçon introuvable.'));
  }, [slug, lessonSlug]);

  useEffect(() => {
    if (!lesson) return;
    api
      .get('/progress')
      .then((res) => setCompleted(res.data.includes(lesson.id)))
      .catch(() => {});
  }, [lesson]);

  const check = async () => {
    setChecking(true);
    setResult(null);
    setCheckError('');
    try {
      const res = await api.post(`/lessons/${lesson.id}/check`, { code });
      setResult(res.data);
      if (res.data.passed) setCompleted(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setCheckError('Trop de vérifications, attends un instant.');
      } else {
        setCheckError(err.response?.data?.message || 'Vérification impossible.');
      }
    } finally {
      setChecking(false);
    }
  };

  const markDone = async () => {
    try {
      await api.post(`/lessons/${lesson.id}/complete`);
      setCompleted(true);
    } catch {
      setCheckError('Action impossible.');
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!lesson) return <p>Chargement...</p>;

  const hasExercise = Boolean(lesson.exercise_prompt);

  return (
    <div>
      <Link to={`/languages/${slug}`} className="text-sm text-indigo-600 hover:underline">
        ← Retour aux leçons
      </Link>

      <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold">
        {lesson.title}
        {completed && <span title="Terminée">✅</span>}
      </h1>

      <article className="prose prose-slate mt-6 max-w-none rounded-xl bg-white p-6 shadow-sm">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </article>

      {hasExercise ? (
        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Exercice</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{lesson.exercise_prompt}</p>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-300">
            <Editor
              height="260px"
              language={MONACO[slug] || 'plaintext'}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          <div className="mt-4">
            <button onClick={check} disabled={checking} className={buttonClass}>
              {checking ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>

          {checkError && (
            <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{checkError}</p>
          )}

          {result && (
            <div className="mt-4">
              <p
                className={`rounded p-2 text-sm font-medium ${
                  result.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {result.passed
                  ? 'Bravo, exercice réussi !'
                  : "Ce n'est pas encore la bonne sortie, réessaie."}
              </p>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-sm text-slate-100">
                {result.output || '(aucune sortie)'}
              </pre>
            </div>
          )}
        </section>
      ) : (
        !completed && (
          <div className="mt-8">
            <button onClick={markDone} className={buttonClass}>
              Marquer comme terminée
            </button>
          </div>
        )
      )}
    </div>
  );
}