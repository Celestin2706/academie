import { useState } from 'react';
import Editor from '@monaco-editor/react';
import api from '../api';

const LANGUAGES = [
  {
    id: 'python',
    label: 'Python',
    monaco: 'python',
    starter: 'nom = input("Ton nom ? ")\nprint("Bonjour", nom)',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    monaco: 'javascript',
    starter: 'console.log("Bonjour");',
  },
];

export default function CodeEditor() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [stdin, setStdin] = useState('Paul');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const changeLanguage = (e) => {
    const lang = LANGUAGES.find((l) => l.id === e.target.value);
    setLanguage(lang);
    setCode(lang.starter);
    setOutput('');
    setError('');
  };

  const run = async () => {
    setRunning(true);
    setOutput('');
    setError('');
    try {
      const res = await api.post('/run', { language: language.id, code, stdin });
      const { compile, output: out, signal, status, message } = res.data;
      setOutput([compile, out].filter(Boolean).join('\n') || '(aucune sortie)');
      if (signal) {
        setError(
          `Le programme a été arrêté (${signal}${status ? ', ' + status : ''}). ` +
            `Il a probablement dépassé la limite de temps.${message ? ' ' + message : ''}`
        );
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Trop d'exécutions, attends un instant.");
      } else {
        setError(err.response?.data?.message || "Erreur lors de l'exécution.");
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <select
          value={language.id}
          onChange={changeLanguage}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          onClick={run}
          disabled={running}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {running ? 'Exécution...' : '▶ Exécuter'}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-300">
        <Editor
          height="320px"
          language={language.monaco}
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>

      <label className="mt-4 block text-sm font-semibold text-slate-700">
        Entrées du programme (une valeur par ligne)
        <textarea
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm font-normal focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Écris ici ce que ton programme demande avec input()"
        />
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Chaque appel à <code>input()</code> lit la ligne suivante de ce champ.
      </p>

      <h3 className="mt-4 mb-2 text-sm font-semibold text-slate-700">Résultat</h3>
      {error && <p className="mb-2 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <pre className="min-h-20 whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-sm text-slate-100">
        {output}
      </pre>
    </div>
  );
}