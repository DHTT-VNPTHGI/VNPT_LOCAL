import React from "react";
import { NavLink } from "react-router-dom";

function Header({ isLoggedIn, onLogin, onLogout, onSignUp }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="/">
          Thiết Bị Quản Lý
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Chuyển đổi điều hướng"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Menu Thiết bị */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="deviceDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Báo hỏng
              </a>
              <ul
                className="dropdown-menu shadow-sm"
                aria-labelledby="deviceDropdown"
              >
                <li>
                  <NavLink className="dropdown-item" to="/ReportBrokenList" activeClassName="active">
                    Danh sách báo hỏng
                </NavLink>
                </li>
                <li>
                  <a className="dropdown-item" href="/software">
                    Danh sách SW
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          {/* Menu Quản lý */}
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
            {!isLoggedIn ? (
              <>
              <li className="nav-item me-3">
  <NavLink to="/login" className="btn btn-outline-light px-3 py-1 rounded text-center">
    Đăng nhập
  </NavLink>
</li>
                <li className="nav-item">
                  <button
                    className="btn btn-light text-primary px-3 py-1 rounded fw-semibold"
                    onClick={onSignUp}
                  >
                    Đăng ký
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light px-3 py-1 rounded"
                  onClick={onLogout}
                >
                  Đăng xuất
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
