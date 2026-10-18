import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import ChatBox from '../components/ChatBox';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/chat/messages');
      setMessages(res.data);
    } catch {
      // on réessaiera au prochain cycle
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [load]);

  const send = async (body) => {
    await api.post('/chat/messages', { body });
    await load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Discuter avec l'administrateur</h1>
      <p className="mt-1 mb-6 text-slate-600">
        Pose tes questions, tu recevras une réponse ici.
      </p>
      <ChatBox messages={messages} meId={user.id} onSend={send} />
    </div>
  );
}