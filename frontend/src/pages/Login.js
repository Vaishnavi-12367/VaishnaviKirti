import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Save user data
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userPlan", res.data.plan);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("tenantId", res.data.tenantId);
      localStorage.setItem("billingCycle", res.data.billingCycle);
      localStorage.setItem("isLoggedIn", "true");

      alert("Login successful!");
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
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
