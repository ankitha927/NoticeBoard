import React, { useState } from "react";
import axios from "axios";

const Login = ({ setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password, role: selectedRole });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      setRole(response.data.role);

      alert("✅ Login successful!");
    } catch (error) {
      alert("❌ Login failed. Please check credentials.");
    }
  };

  return (
    <div>
      <h2>🔑 Login</h2>
      
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="student">Student</option>
      </select>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
