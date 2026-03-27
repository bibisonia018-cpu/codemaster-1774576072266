import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const scrollRef = useRef();
  const username = localStorage.getItem('chat_username');

  useEffect(() => {
    if (!username) navigate('/');

    // الاستماع اللحظي للرسائل في الغرفة المحددة فقط
    const q = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [roomId]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const currentText = text;
    setText('');
    await addDoc(collection(db, "messages"), {
      text: currentText,
      sender: username,
      roomId: roomId,
      createdAt: serverTimestamp()
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0B0E11' }}>
      <div style={{ padding: '15px', background: '#15191C', borderBottom: '1px solid #333' }}>
        غرفة: {roomId}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map(m => (
          <div key={m.id} style={{ textAlign: m.sender === username ? 'left' : 'right', marginBottom: '10px' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '10px', 
              borderRadius: '10px', 
              background: m.sender === username ? '#00A884' : '#15191C' 
            }}>
              <small style={{ display: 'block', fontSize: '10px', opacity: 0.7 }}>{m.sender}</small>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={send} style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="رسالة..."
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', outline: 'none', background: '#15191C', color: 'white' }}
        />
        <button style={{ background: '#00A884', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>إرسال</button>
      </form>
    </div>
  );
}