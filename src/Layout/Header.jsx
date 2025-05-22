import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
function Header(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const users = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
     useEffect(() => {
        console.log(props.dataRedux)
     }, [])
  const logout = () => {
    localStorage.removeItem('user')
    toast.success("Đăng xuất thành công")
    props.logout()
  }
  return (
  <>
    {/* Navbar trên cùng (mobile) */}
      <nav className="navbar navbar-dark bg-primary shadow-sm px-3 d-flex d-lg-none justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={toggleSidebar}
          aria-label="Mở menu"
        >
          &#9776;
        </button>

        <NavLink className="navbar-brand fw-bold fs-4 text-white" to="/">
          Thiết Bị Quản Lý
        </NavLink>

        {/* Chỗ để cân bằng khoảng trắng */}
        <div style={{ width: 40 }} />
      </nav>

      {/* Sidebar menu (mobile) */}
      <div
        className={`sidebar bg-primary text-white position-fixed top-0 start-0 vh-100 p-3 d-lg-none ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
        style={{ width: "250px", zIndex: 1045 }}
      >
        <button
          className="btn btn-light mb-4"
          onClick={toggleSidebar}
          aria-label="Đóng menu"
        >
          &times;
        </button>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink
              className="nav-link text-white"
              to="/ReportBrokenList"
              onClick={toggleSidebar}
            >
              Danh sách báo hỏng
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              className="nav-link text-white"
              to="/EmployeeList"
              onClick={toggleSidebar}
            >
              Danh sách nhân viên
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              className="nav-link text-white"
              to="/software"
              onClick={toggleSidebar}
            >
              Danh sách SW
            </NavLink>
          </li>

          {/* Menu đăng nhập/đăng xuất */}
          {!users && !props.dataRedux?.user?.username ? (
            <>
              <li className="nav-item mb-2">
                <NavLink
                  className="btn btn-outline-light w-100 text-center"
                  to="/login"
                  onClick={toggleSidebar}
                >
                  Đăng nhập
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  className="btn btn-light text-primary w-100 text-center"
                  to="/signUp"
                  onClick={toggleSidebar}
                >
                  Đăng kí
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item mb-2">
                <button
                  className="btn btn-outline-light w-100"
                  onClick={() => {
                    logout();
                    toggleSidebar();
                  }}
                >
                  Đăng xuất
                </button>
              </li>
              <li className="nav-item mb-2 text-white fw-semibold px-2">
                Xin chào{" "}
                {props.dataRedux?.user?.username || (users && users.username)}
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Overlay khi sidebar mở */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay position-fixed top-0 start-0 vw-100 vh-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Navbar menu (desktop) */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm d-none d-lg-block">
        <div className="container">
          {/* Menu trái */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="reportBrokenDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Báo hỏng
              </a>
              <ul
                className="dropdown-menu shadow-sm"
                aria-labelledby="reportBrokenDropdown"
              >
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/ReportBrokenList"
                    activeClassName="active"
                  >
                    Danh sách báo hỏng
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/software">
                    Danh sách SW
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="listDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Danh sách
              </a>
              <ul
                className="dropdown-menu shadow-sm"
                aria-labelledby="listDropdown"
              >
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/EmployeeList"
                    activeClassName="active"
                  >
                    Danh sách nhân viên
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/software">
                    Danh sách SW
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>

          {/* Menu phải */}
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
            {!users && !props.dataRedux?.user?.username ? (
              <>
                <li className="nav-item me-3">
                  <NavLink
                    to="/login"
                    className="btn btn-outline-light px-3 py-1 rounded text-center"
                  >
                    Đăng nhập
                  </NavLink>
                </li>
                <li className="nav-item me-3">
                  <NavLink
                    to="/signUp"
                    className="btn btn-light text-primary px-3 py-1 rounded fw-semibold"
                  >
                    Đăng kí
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <button
                    className="btn btn-outline-light px-3 py-1 rounded text-center"
                    onClick={() => logout()}
                  >
                    Đăng xuất
                  </button>
                </li>
                <li className="nav-item me-3 text-white fw-semibold">
                  Xin chào{" "}
                  {props.dataRedux?.user?.username || (users && users.username)}
                </li>
              </>
            )}
          </ul>
        </div>
</nav>
      </>
  );
}

const mapStateToProps = (state) => {
  return { dataRedux: state };
};
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch({ type: "LOGOUT" }),

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Header);
