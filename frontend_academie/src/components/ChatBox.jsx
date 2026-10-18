import { useEffect, useRef, useState } from 'react';

export default function ChatBox({ messages, meId, onSend }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const submit = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSending(true);
    setError('');
    try {
      await onSend(body);
      setText('');
    } catch {
      setError("Le message n'a pas pu être envoyé.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div
        ref={listRef}
        className="h-96 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4"
      >
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">Aucun message pour le moment.</p>
        )}

        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={mine ? 'text-right' : 'text-left'}>
              <span
                className={`inline-block max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-left text-sm ${
                  mine ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-900'
                }`}
              >
                {m.body}
              </span>
              <div className="mt-1 text-xs text-slate-400">
                {new Date(m.created_at).toLocaleString('fr-FR')}
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Écris ton message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}