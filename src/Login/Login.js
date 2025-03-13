import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (username === "admin" && password === "123") {
      localStorage.setItem("isAuthenticated", "true"); 
      navigate("/AdminDashboard");
    } else if (username === "rm" && password === "123"){
      localStorage.setItem("isAuthenticated", "true"); 
      navigate("/RMpage");
    } else if (username === "staf" && password === "123"){
      localStorage.setItem("isAuthenticated", "true"); 
      navigate("/StafPage");
    }
    else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} aria-label="Login Form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;