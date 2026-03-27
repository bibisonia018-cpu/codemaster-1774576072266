import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const join = (e) => {
    e.preventDefault();
    if (user && room) {
      localStorage.setItem('chat_username', user);
      navigate(`/chat/${room}`);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={join} style={{ background: '#15191C', padding: '2rem', borderRadius: '1rem', width: '300px' }}>
        <h2 style={{ textAlign: 'center', color: '#00A884' }}>دخول الغرفة</h2>
        <input 
          placeholder="اسمك" 
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}
          onChange={e => setUser(e.target.value)}
        />
        <input 
          placeholder="كود الغرفة السري" 
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }}
          onChange={e => setRoom(e.target.value)}
        />
        <button style={{ width: '100%', padding: '10px', background: '#00A884', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>دخول</button>
      </form>
    </div>
  );
}