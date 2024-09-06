// frontend/pages/login.js
import { useState } from "react";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      // localStorage.setItem('token', response.data.token); // Store JWT Token
      // alert(response.data.message);   // Reminder log in successful
      if (response && response.data) {
        setMessage('Login successful: ' + response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        console.error('Unexpected response structure:', response);
        setMessage('Unexpected response structure');
      }
    } catch (error) {
      // console.error(error.response.data.error);
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessage('Login failed: ' + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <div>{message}</div>} {/* Show the login status*/}
    </div>
  );
};

export default Login;