import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
    console.log("Signup Error:", err);
    if (err.response) {
    console.log("Backend Response:", err.response.data);
  }
    alert("Error signing up");
}

  };

  return (
  <div style={cardStyle}>
    <h2 style={{ color: "#000", marginBottom: "10px" }}>
    🚀 Create Account
    </h2>
    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "25px" }}>
    Create your workspace and start building ✨
    </p>
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <input name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
      <input name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} style={inputStyle} />
      <button type="submit" style={buttonStyle}>Sign Up</button>
    </form>
  </div>
);
}
const cardStyle = {
  background: "white",
  padding: "45px",
  borderRadius: "16px",
  width: "380px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  textAlign: "center"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  outline: "none",

};

const buttonStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
  color: "white",
  fontWeight: "bold",
  fontSize: "15px",
  cursor: "pointer"
};

export default  Signup;
