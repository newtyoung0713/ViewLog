// frontend/pages/register.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // If logged, redirect the page to main page
    if (token) router.push('/');
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { email, password });
      alert(response.data.message);
      console.log(response.data);
      router.push('/');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data.error);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div className="input-wrapper">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-wrapper">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit">Register</button>
        </div>
      </form>

      <style jsx>{`
        .form-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 80vh;
        }

        .input-wrapper {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }

        .button-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        form {
          background-color: #f2f2f2;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 300px;
        }

        button {
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}

export default Register;