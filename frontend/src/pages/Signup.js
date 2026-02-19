import "./Auth.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password
      });
      alert("Signup successful!");
      navigate("/login");  
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "Signup failed";
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Manage your subscriptions with ease.
        </p>

        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
        </form>
        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;
