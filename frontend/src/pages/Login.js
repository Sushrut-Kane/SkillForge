import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("userEmail", res.data.email);
        navigate("/home"); // no alert needed
      }
    } catch (error) {
      console.log("Login error:", error);
      alert(
        "Login failed: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login to SkillForge</h2>

        <form className="login-form" onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>

        <p className="signup-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
