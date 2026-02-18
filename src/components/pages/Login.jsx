import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
  const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(URL, {
        email: email,
        password: password,
        returnSecureToken: true
      });
      const token = response.data.idToken;
      localStorage.setItem('token', token);
      setToken(token);
      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Podego Dashboard Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br/><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;