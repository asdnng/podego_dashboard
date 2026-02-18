import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';

let isSessionExpired = false;

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401 && !isSessionExpired) {
          
          isSessionExpired = true; 
          
          alert("Session expired. Please log in again.");
          
          localStorage.removeItem('token');
          setToken(null);
          
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <div>
      {!token ? <Login setToken={setToken} /> : <Dashboard token={token} />}
    </div>
  );
}

export default App;