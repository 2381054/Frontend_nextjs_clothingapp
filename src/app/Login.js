'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_AUTH_URL = 'http://localhost:4000/api/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for register
  const [isRegistering, setIsRegistering] = useState(false); // Toggle Login/Register
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const payload = isRegistering
        ? { email, password, name, type: 'register' }
        : { email, password, type: 'login' };

      const response = await fetch(API_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isRegistering ? 'Registration failed' : 'Login failed'));
      }

      if (isRegistering) {
        alert('Registration successful! Please login.');
        setIsRegistering(false); // Switch to login mode after successful register
        setEmail('');
        setPassword('');
        setName('');
      } else {
        // Save user and redirect
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/order');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '40px' }}>
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleAuth}>
        <div style={{ marginBottom: '20px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {isRegistering && (
          <div style={{ marginBottom: '20px' }}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        )}

        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              border: 'none',
              background: 'none',
              color: '#007BFF',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
