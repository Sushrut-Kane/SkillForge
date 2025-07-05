import { Link } from "react-router-dom";
import "./Navbar.css"; // (we’ll create this next)

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">SkillForge 🔥</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
