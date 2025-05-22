import React, { useState } from "react";
import UserService from "../Service/UserService";
import Header from "../Layout/Header";
import { toast } from "react-toastify";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [telegram, setTelegram] = useState("");
  const [role, setRole] = useState("User"); // Mặc định là 'User'
  function generateRandomId(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu và nhập lại mật khẩu có khớp không
    if (password !== repassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (!username || !password || !telegram) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      // Gọi service đăng ký
        const newUser = {
        id:generateRandomId(),
        username:username,
        password:password,
        telegram:telegram,
        role:role,
      };
        console.log(newUser)
        UserService.update(newUser).then(
            res => {
            toast.success("Đăng ký thành công")
            setUsername("")
            setPassword("")
            setRepassword("")
            setTelegram("")
            
          }
      )
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <h2 className="mb-4 text-center">Đăng kí tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="loginUsername" className="form-label">
              Tên đăng nhập
            </label>
            <input
              type="text"
              className="form-control"
              id="loginUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="telegram" className="form-label">
              Tài khoản Telegram
            </label>
            <input
              type="text"
              className="form-control"
              id="telegram"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="Nhập tài khoản Telegram"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="loginRePassword" className="form-label">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              className="form-control"
              id="loginRePassword"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          {/* Trường quyền truy cập */}
          <div className="mb-3">
            <label htmlFor="roleSelect" className="form-label">
              Quyền truy cập
            </label>
            <select
              className="form-select"
              id="roleSelect"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
             
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Đăng kí
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
