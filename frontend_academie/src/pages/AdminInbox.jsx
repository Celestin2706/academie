import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AdminInbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/admin/conversations');
      setConversations(res.data);
    } catch {
      // on réessaiera au prochain cycle
    }
  }, []);

  useEffect(() => {
    if (user.role !== 'admin') return;
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load, user.role]);

  if (user.role !== 'admin') {
    return <p className="text-red-600">Accès réservé à l'administrateur.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Boîte de réception</h1>
      <p className="mt-1 text-slate-600">Les conversations avec tes utilisateurs.</p>

      <div className="mt-6 space-y-2">
        {conversations.length === 0 && (
          <p className="text-slate-500">Aucune conversation pour le moment.</p>
        )}

        {conversations.map((c) => (
          <Link
            key={c.id}
            to={`/admin/chat/${c.id}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-400"
          >
            <div>
              <div className="font-medium">{c.user.name}</div>
              <div className="text-sm text-slate-500">{c.user.email}</div>
            </div>
            <div className="text-right">
              {c.unread_count > 0 && (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {c.unread_count}
                </span>
              )}
              <div className="mt-1 text-xs text-slate-400">
                {new Date(c.last_message_at).toLocaleString('fr-FR')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}