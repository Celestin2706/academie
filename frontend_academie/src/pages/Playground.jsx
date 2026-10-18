import CodeEditor from '../components/CodeEditor';

export default function Playground() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Éditeur de code</h1>
      <p className="mt-1 mb-6 text-slate-600">
        Écris du code, clique sur « Exécuter » et vois le résultat.
      </p>
      <CodeEditor />
    </div>
  );
}