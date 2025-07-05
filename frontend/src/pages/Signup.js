import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios"; //  uses your configured axios
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signup", {
        email,
        password,
        name,
      });

      if (res.status === 201) {
        alert("Signup successful!");
        localStorage.setItem("userName", name);
        navigate("/"); 
      }
    } catch (error) {
      console.error("Signup error:", error); // log full error
      alert(
        "Signup failed: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Create your SkillForge account</h2>

        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
