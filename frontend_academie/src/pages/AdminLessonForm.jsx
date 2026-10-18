import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

const EMPTY = {
  language_id: '',
  title: '',
  level: 'debutant',
  content: '',
  position: 0,
  published: true,
  exercise_prompt: '',
  exercise_starter: '',
  exercise_expected: '',
};

const inputClass =
  'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';
const labelClass = 'block text-sm font-medium text-slate-700';

export default function AdminLessonForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user.role !== 'admin') return;

    api.get('/languages').then((res) => {
      setLanguages(res.data);
      if (!id && res.data.length > 0) {
        setForm((f) => ({ ...f, language_id: f.language_id || res.data[0].id }));
      }
    });

    if (id) {
      api
        .get(`/admin/lessons/${id}`)
        .then((res) => {
          const l = res.data;
          setForm({
            language_id: l.language_id,
            title: l.title,
            level: l.level,
            content: l.content,
            position: l.position,
            published: l.published,
            exercise_prompt: l.exercise_prompt ?? '',
            exercise_starter: l.exercise_starter ?? '',
            exercise_expected: l.exercise_expected ?? '',
          });
        })
        .catch(() => setError('Leçon introuvable.'));
    }
  }, [id, user.role]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      language_id: Number(form.language_id),
      position: Number(form.position),
      exercise_prompt: form.exercise_prompt.trim() || null,
      exercise_starter: form.exercise_starter || null,
      exercise_expected: form.exercise_expected.trim() || null,
    };

    try {
      if (id) {
        await api.put(`/admin/lessons/${id}`, payload);
      } else {
        await api.post('/admin/lessons', payload);
      }
      navigate('/admin/lessons');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors)[0][0]
          : err.response?.data?.message || 'Enregistrement impossible.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (user.role !== 'admin') {
    return <p className="text-red-600">Accès réservé à l'administrateur.</p>;
  }

  return (
    <div>
      <Link to="/admin/lessons" className="text-sm text-indigo-600 hover:underline">
        ← Retour à la liste
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{id ? 'Modifier la leçon' : 'Nouvelle leçon'}</h1>

      {error && <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={submit} className="mt-6 space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            Langage
            <select
              className={inputClass}
              value={form.language_id}
              onChange={set('language_id')}
              required
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Niveau
            <select className={inputClass} value={form.level} onChange={set('level')}>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
          </label>

          <label className={labelClass}>
            Position (ordre)
            <input
              className={inputClass}
              type="number"
              min="0"
              value={form.position}
              onChange={set('position')}
              required
            />
          </label>
        </div>

        <label className={labelClass}>
          Titre
          <input className={inputClass} value={form.title} onChange={set('title')} required />
        </label>

        <label className={labelClass}>
          Contenu (Markdown)
          <textarea
            className={`${inputClass} font-mono`}
            rows={14}
            value={form.content}
            onChange={set('content')}
            required
          />
        </label>

        <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-700">
            Exercice (facultatif)
          </legend>

          <label className={labelClass}>
            Consigne
            <textarea
              className={inputClass}
              rows={3}
              value={form.exercise_prompt}
              onChange={set('exercise_prompt')}
            />
          </label>

          <label className={labelClass}>
            Code de départ
            <textarea
              className={`${inputClass} font-mono`}
              rows={5}
              value={form.exercise_starter}
              onChange={set('exercise_starter')}
            />
          </label>

          <label className={labelClass}>
            Sortie attendue (exactement ce que le programme doit afficher)
            <textarea
              className={`${inputClass} font-mono`}
              rows={3}
              value={form.exercise_expected}
              onChange={set('exercise_expected')}
            />
          </label>
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publiée (visible par les utilisateurs)
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}