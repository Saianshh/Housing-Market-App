import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

const Login = ({handleLogin, settingUsername}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function onUsernameUpdate (event) {
    setUsername(event.target.value);
    settingUsername(event.target.value);
  }

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameUpdate(e)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;
