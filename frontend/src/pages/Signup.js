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
      alert("Error signing up");
    }
  };

  return (
  <div style={cardStyle}>
    <h2 style={{ color: "#fff", marginBottom: "20px" }}>Create Account</h2>
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
  background: "#1e293b",
  padding: "40px",
  borderRadius: "12px",
  width: "350px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  textAlign: "center"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  background: "#334155",
  color: "#fff"
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#3b82f6",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s"
};

export default Signup;
