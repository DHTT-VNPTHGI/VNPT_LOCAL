import React, { useState } from "react";
import Header from "../Layout/Header";
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom"
import UserService from "../Service/UserService";
import { toast } from "react-toastify";
function Login(props) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  let navitive = useNavigate()
  const handleSubmit = e => {
     e.preventDefault();
    UserService.getAll().then(
      res => {
        let data = Object.values(res.data).filter(e => e.username == username && e.password == password)
        if (data.length) {
          console.log(data)
          toast.success("Đăng nhập thành công")
          localStorage.setItem("user", JSON.stringify(data[0]))
          props.login(data[0])
          navitive("/")
        }
        else {
          toast.error("Đăng nhập thất bại!!!")
        }
        
    }
  )
  // props.login(res.data)
  // navitive("/")
  };

  return (
    <>
      <Header />
       <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="loginusername" className="form-label">Tên đăng nhập</label>
          <input
            type="text"
            className="form-control"
            id="loginusername"
            value={username}
            onChange={e => setusername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
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
    </>
  );
}
const mapStateToProps = (state) => {
    console.log(state);
    return {


        dataRedux: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (e) => dispatch({ type: 'LOGIN', payload: e }),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

