// src/App.js
import React, { useEffect, useState } from "react";
import MyMap from "./component/MyMap";
import UserService from "./service/UserService";
import { toast } from "react-toastify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(()=>{
    const storedUser = localStorage.getItem("username");
    const storedPass = localStorage.getItem("password");
     UserService.getAll().then(
      res=>{
        console.log(Object.values(res.data))
       let list= Object.values(res.data).filter(e=>e.username==storedUser && e.password==storedPass)
         if (
     list&&list.length>0
    ) {
      setIsLoggedIn(true);
     
    } 
      }
    )
  },[])
  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("username");
    const storedPass = localStorage.getItem("password");
    UserService.getAll().then(
      res=>{
        console.log(Object.values(res.data))
       let list= Object.values(res.data).filter(e=>e.username==username && e.password==password)
         if (
     list&&list.length>0
    ) {
      setIsLoggedIn(true);
      toast.success("Đăng nhập thành công")
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
      }
    )

   
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      UserService.update({username:username,password:password}).then(
        res=>{
          toast.success("Đăng kí tài khoản thành công")
        }
      )
     
      setMode("login");
    } else {
      toast.error("Vui lòng nhập đủ thông tin!!!")
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
          <h3 className="text-center mb-4">
            {mode === "login" ? "🔑 Đăng nhập" : "📝 Đăng ký"}
          </h3>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            <div className="mb-3">
              <label className="form-label">Tên đăng nhập</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {mode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          <div className="text-center mt-3">
            {mode === "login" ? (
              <p>
                Chưa có tài khoản?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setMode("register")}
                >
                  Đăng ký
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setMode("login")}
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-danger m-1" onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
      <MyMap />
    </div>
  );
}

export default App;
