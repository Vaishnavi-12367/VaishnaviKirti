import "./Auth.css";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password
      });
      alert("Signup successful!");
    } catch (err) {
      alert("Signup failed");
    }
  };

  // 👇 ADD RETURN HERE
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p style={{
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "20px",
  lineHeight: "1.5"
}}>
 Manage your subscriptions with ease.
</p>

        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
        </form>
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
  Already have an account?{" "}
  <span
    style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
    onClick={() => (window.location.href = "/login")}
  >
    Login
  </span>
</p>

      </div>
    </div>
  );
};

export default Signup;
