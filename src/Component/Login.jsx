import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
  
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="loginEmail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="loginPassword"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
