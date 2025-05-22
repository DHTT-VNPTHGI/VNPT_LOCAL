import React, { useState, useEffect } from "react";
import Header from "../../Layout/Header";
import EmployeeService from "../../Service/EmployeeService";
import { toast } from "react-toastify";

function EmployeeManager() {
  // Dữ liệu mẫu
  const [employees, setEmployees] = useState([
    {
      id: "nv001",
     
      name: "Nguyễn Văn A",
      technicalLine: "Tuyến 1",
      telecomCenter: "Trung tâm viễn thông 1",
      phone: "0901234567",
    },
    {
      id: "nv002",
    
      name: "Trần Thị B",
      technicalLine: "Tuyến 2",
      telecomCenter: "Trung tâm viễn thông 2",
      phone: "0912345678",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // false = add, true = edit

  // Form state
  const [currentId, setCurrentId] = useState(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [technicalLine, setTechnicalLine] = useState("");
  const [telecomCenter, setTelecomCenter] = useState("");
  const [phone, setPhone] = useState("");

  // Lọc danh sách theo searchTerm
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (e) =>
            e.code.toLowerCase().includes(lower) ||
            e.name.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, employees]);

  // Hàm tạo ID ngẫu nhiên
  function generateRandomId(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId(null);
    setCode("");
    setName("");
    setTechnicalLine("");
    setTelecomCenter("");
    setPhone("");
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setEditMode(true);
    setCurrentId(employee.id);
    setCode(employee.code);
    setName(employee.name);
    setTechnicalLine(employee.technicalLine);
    setTelecomCenter(employee.telecomCenter);
    setPhone(employee.phone);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ( !name || !technicalLine || !telecomCenter || !phone) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

      if (editMode) {
        const newEmployee = {
        id: currentId,
        name:name,
       technicalLine: technicalLine,
       telecomCenter: telecomCenter,
        phone:phone,
        };
        EmployeeService.update(newEmployee).then(res => {
            console.log("Thêm dữ liệu thành công !!")
            toast.success("Cập nhật dữ liệu thành công !!")
    })
      // Cập nhật
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === currentId
            ? { ...e, name, technicalLine, telecomCenter, phone }
            : e
        )
      );
    } else {
      // Thêm mới
      const newEmployee = {
        id: generateRandomId(),
        name:name,
       technicalLine: technicalLine,
       telecomCenter: telecomCenter,
        phone:phone,
        };
        EmployeeService.update(newEmployee).then(res => {
        console.log("Thêm dữ liệu thành công !!")
            toast.success("Thêm dữ liệu thành công !!")
    })
      setEmployees((prev) => [newEmployee, ...prev]);
    }

    setShowModal(false);
  };

  return (
      <>
          <Header />
       <div className="container mt-4">
      <h2>Quản lý nhân viên</h2>

      <div className="d-flex justify-content-between align-items-center my-3 flex-wrap gap-2">
        <button className="btn btn-success" onClick={openAddModal}>
          Thêm nhân viên
        </button>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm kiếm theo mã hoặc tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
  <div style={{ overflowX: "auto" }}>
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>Mã nhân viên</th>
            <th>Tên nhân viên</th>
            <th>Tuyến kỹ thuật</th>
            <th>Trung tâm</th>
            <th>Số điện thoại</th>
            <th style={{ width: 150 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Không có nhân viên phù hợp
              </td>
            </tr>
          ) : (
            filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.technicalLine}</td>
                <td>{emp.telecomCenter}</td>
                <td>{emp.phone}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEditModal(emp)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
</div>
      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Sửa nhân viên" : "Thêm nhân viên mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">
                    Tên nhân viên
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="technicalLineInput" className="form-label">
                    Tuyến kỹ thuật
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="technicalLineInput"
                    value={technicalLine}
                    onChange={(e) => setTechnicalLine(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telecomCenterInput" className="form-label">
                    Trung tâm
                  </label>
                  <select
                    className="form-select"
                    id="telecomCenterInput"
                    value={telecomCenter}
                    onChange={(e) => setTelecomCenter(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn Trung tâm-</option>
                    <option value="Trung tâm viễn thông 1">Trung tâm viễn thông 1</option>
                    <option value="Trung tâm viễn thông 2">Trung tâm viễn thông 2</option>
                    <option value="Trung tâm viễn thông 3">Trung tâm viễn thông 3</option>
                    <option value="Trung tâm viễn thông 4">Trung tâm viễn thông 4</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneInput" className="form-label">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneInput"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10,15}"
                    title="Số điện thoại gồm 10-15 chữ số"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? "Lưu" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      </>
  );
}

export default EmployeeManager;
