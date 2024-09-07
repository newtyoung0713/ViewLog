// frontend/pages/login.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios';
import Cookies from 'js-cookie';  // Setting cookie after login successful

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track is user logging
  const [username, setUsername] = useState(''); // For display user name
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // If logged, redirect the page to main page
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { token, username } = response.data;

      Cookies.set('token', token);  // Using Cookies to store token

      // Save token and username to localStorage
      localStorage.setItem('username', username);
      
      // Update state immediately
      setIsLoggedIn(true);
      setUsername(username.split('@')[0]);
      
      // Redirect to homepage
      await router.push('/');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
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
    </div>
  );
};

export default Login;