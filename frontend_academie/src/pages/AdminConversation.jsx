import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import ChatBox from '../components/ChatBox';

export default function AdminConversation() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/admin/conversations/${id}/messages`);
      setData(res.data);
    } catch {
      // on réessaiera au prochain cycle
    }
  }, [id]);

  useEffect(() => {
    if (user.role !== 'admin') return;
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [load, user.role]);

  if (user.role !== 'admin') {
    return <p className="text-red-600">Accès réservé à l'administrateur.</p>;
  }

  const send = async (body) => {
    await api.post(`/admin/conversations/${id}/messages`, { body });
    await load();
  };

  return (
    <div>
      <Link to="/admin/inbox" className="text-sm text-indigo-600 hover:underline">
        ← Boîte de réception
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{data ? data.user.name : 'Conversation'}</h1>
      {data && <p className="mb-6 text-slate-500">{data.user.email}</p>}
      {data && <ChatBox messages={data.messages} meId={user.id} onSend={send} />}
    </div>
  );
}