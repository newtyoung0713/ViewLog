// frontend/pages/register.js
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle register logic here
    console.log('Register with:', email, password);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}