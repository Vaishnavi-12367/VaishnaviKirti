import { useEffect } from "react";
import "./Auth.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
  const loggedIn = localStorage.getItem("isLoggedIn");
  if (loggedIn) {
    navigate("/dashboard");
  }
}, []);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // store user info
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userPlan", res.data.plan);
      localStorage.setItem("isLoggedIn", "true");

      alert("Login successful!");

      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <a href="/">Signup</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
