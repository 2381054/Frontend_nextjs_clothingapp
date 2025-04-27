// src/app/AuthPage.js
import React, { useState } from 'react';

const API_URL = 'http://localhost:4000/api/auth'; // Pastikan sesuai backend kamu

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: isRegister ? name : undefined,
          type: isRegister ? 'register' : 'login',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Auth failed');

      alert(data.message);
      console.log('User:', data.user);

      // TODO: setelah login sukses, redirect ke halaman lain
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '40px' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label>Name:</label><br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            /><br />
          </div>
        )}
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        onClick={() => setIsRegister(!isRegister)}
        style={{ marginTop: '20px', background: 'transparent', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  );
}
