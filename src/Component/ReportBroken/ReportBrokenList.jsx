import React, { useState, useEffect } from "react";
import Header from "../../Layout/Header";
import BrokenReportService from "../../Service/BrokenReportService";
import { toast } from "react-toastify";

function BrokenReportList() {
  // Danh sách nhân viên mẫu
  const employees = [
    { id: "nv1", name: "Nguyễn Văn A" },
    { id: "nv2", name: "Trần Thị B" },
    { id: "nv3", name: "Lê Văn C" },
  ];

  // Dữ liệu mẫu báo hỏng
  const [reports, setReports] = useState([
    {
      id: "a1b2c3d4e5",
      code: "BH001",
      name: "Báo hỏng máy in",
      status: "Chờ xử lý",
      createdAt: "2023-05-18",
      userReporter: "Nguyễn Văn A",
      phone: "0901234567",
      employee: "nv1",
      startAppointment: "2023-05-21T08:00",
      endAppointment: "2023-05-21T10:00",
      reason: "Máy in kêu to và không in được",
    },
    {
      id: "f6g7h8i9j0",
      code: "BH002",
      name: "Màn hình không lên",
      status: "Đã xử lý",
      createdAt: "2023-05-20",
      userReporter: "Trần Thị B",
      phone: "0912345678",
      employee: "nv2",
      startAppointment: "2023-05-22T09:00",
      endAppointment: "2023-05-22T11:00",
      reason: "Màn hình tắt không bật được",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredReports, setFilteredReports] = useState(reports);

  const [showModal, setShowModal] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("Chờ xử lý");
  const [newCreatedAt, setNewCreatedAt] = useState("");
  const [newUserReporter, setNewUserReporter] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmployee, setNewEmployee] = useState("");
  const [newStartAppointment, setNewStartAppointment] = useState("");
  const [newEndAppointment, setNewEndAppointment] = useState("");
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.code.toLowerCase().includes(lower)
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (r) => new Date(r.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (r) => new Date(r.createdAt) <= new Date(endDate)
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, startDate, endDate, reports]);

  function generateRandomId(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleAddClick = () => {
    setNewCode("");
    setNewName("");
    setNewStatus("Chờ xử lý");
    setNewCreatedAt("");
    setNewUserReporter("");
    setNewPhone("");
    setNewEmployee("");
    setNewStartAppointment("");
    setNewEndAppointment("");
    setNewReason("");
    setShowModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (
    
      !newCreatedAt ||
      !newUserReporter ||
      !newPhone ||
      !newEmployee ||
      !newStartAppointment ||
      !newEndAppointment
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    const newReport = {
      id: generateRandomId(),
    
      status: newStatus,
      createdAt: newCreatedAt,
      userReporter: newUserReporter,
      phone: newPhone,
      employee: newEmployee,
      startAppointment: newStartAppointment,
      endAppointment: newEndAppointment,
      reason: newReason,
      };
      console.log(newReport)
      BrokenReportService.update(newReport).then(
          res => {
              console.log(res.data)
              toast.success("Thêm dữ liệu thành công !!")
        }
    )
    setReports((prev) => [newReport, ...prev]);
    setShowModal(false);
  };

  const handleEdit = (id) => {
    alert(`Bạn muốn sửa báo hỏng có id=${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa báo hỏng này?")) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Danh sách Báo hỏng</h2>

        <div className="d-flex justify-content-between align-items-center my-3 flex-wrap gap-2">
          <button className="btn btn-success" onClick={handleAddClick}>
            Thêm mới
          </button>

          <input
            type="text"
            className="form-control w-25"
            placeholder="Tìm kiếm theo tên hoặc mã"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            className="form-control w-auto"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Từ ngày"
          />

          <input
            type="date"
            className="form-control w-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Đến ngày"
          />
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
            
             
              <th>Ngày báo hỏng</th>
              <th>User báo hỏng</th>
              <th>Số điện thoại</th>
              <th>Nhân viên</th>
              <th>Thời gian bắt đầu hẹn</th>
              <th>Thời gian kết thúc hẹn</th>
                          <th>Lý do hẹn</th>
                           <th>Trạng thái</th>
              <th style={{ width: 150 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">
                  Không có báo hỏng nào phù hợp
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id}>
                 
                
                  <td>{report.createdAt}</td>
                  <td>{report.userReporter}</td>
                  <td>{report.phone}</td>
                  <td>{employees.find((e) => e.id === report.employee)?.name || report.employee}</td>
                  <td>{report.startAppointment.replace("T", " ")}</td>
                  <td>{report.endAppointment.replace("T", " ")}</td>
                      <td>{report.reason}</td>
                        <td>{report.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(report.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(report.id)}
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

      {/* Modal thêm mới */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="addModalLabel"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <form className="modal-content" onSubmit={handleAddSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">
                  Thêm báo hỏng mới
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                 
                

                  <div className="col-md-6">
                    <label htmlFor="userReporterInput" className="form-label">
                      User báo hỏng
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="userReporterInput"
                      value={newUserReporter}
                      onChange={(e) => setNewUserReporter(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phoneInput" className="form-label">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneInput"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      required
                      pattern="[0-9]{10,15}"
                      title="Số điện thoại gồm 10-15 chữ số"
                    />
                  </div>

                  
                  <div className="col-md-6">
                    <label htmlFor="employeeSelect" className="form-label">
                      Nhân viên
                    </label>
                    <select
                      className="form-select"
                      id="employeeSelect"
                      value={newEmployee}
                      onChange={(e) => setNewEmployee(e.target.value)}
                      required
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="createdAtInput" className="form-label">
                      Ngày báo hỏng
                    </label>
                    <input
                     type="datetime-local"
                      className="form-control"
                      id="createdAtInput"
                      value={newCreatedAt}
                      onChange={(e) => setNewCreatedAt(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="startAppointmentInput" className="form-label">
                      Thời gian bắt đầu hẹn
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="startAppointmentInput"
                      value={newStartAppointment}
                      onChange={(e) => setNewStartAppointment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="endAppointmentInput" className="form-label">
                      Thời gian kết thúc hẹn
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="endAppointmentInput"
                      value={newEndAppointment}
                      onChange={(e) => setNewEndAppointment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="reasonInput" className="form-label">
                      Lý do hẹn
                    </label>
                    <textarea
                      className="form-control"
                      id="reasonInput"
                      rows="3"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                    />
                  </div>
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
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BrokenReportList;
