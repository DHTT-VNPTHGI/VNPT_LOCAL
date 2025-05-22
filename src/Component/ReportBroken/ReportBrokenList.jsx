import React, { useState, useEffect } from "react";
import Header from "../../Layout/Header";
import BrokenReportService from "../../Service/BrokenReportService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function BrokenReportList() {
  const users = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
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
   const [listReports, setListReports] = useState([]);

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

      BrokenReportService.getAll().then(
      res => {
        const data = Object.values(res.data)
          setFilteredReports(data);
          setListReports(data)
      }
    )
  }, [searchTerm, startDate, endDate, reports]);

  function generateRandomId(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
function formatDatetimeLocalToDDMMYYYY_HHMMSS(datetimeLocalStr) {
  if (!datetimeLocalStr) return "";

  const dt = new Date(datetimeLocalStr);

  const pad = (num) => num.toString().padStart(2, "0");

  const day = pad(dt.getDate());
  const month = pad(dt.getMonth() + 1);
  const year = dt.getFullYear();

  const hours = pad(dt.getHours());
  const minutes = pad(dt.getMinutes());
  const seconds = pad(dt.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
      createdAt: formatDatetimeLocalToDDMMYYYY_HHMMSS(newCreatedAt),
      userReporter: newUserReporter,
      phone: newPhone,
      employee: newEmployee,
      startAppointment: formatDatetimeLocalToDDMMYYYY_HHMMSS(newStartAppointment),
      endAppointment: formatDatetimeLocalToDDMMYYYY_HHMMSS(newEndAppointment),
      reason: newReason,
       timeCreate:formatDatetimeLocalToDDMMYYYY_HHMMSS(new Date())
      };
      console.log(newReport)
      BrokenReportService.update(newReport).then(
          res => {
              console.log(res.data)
              toast.success("Thêm dữ liệu thành công !!")
        }
    )
    setFilteredReports((prev) => [newReport, ...prev]);
    setShowModal(false);
  };

  const handleEdit = (id) => {
    const item = filteredReports.filter(e => e.id == id)[0]
    console.log(item)
  };
  const handleCorrect = async(id,flag) => {
    const item = listReports.filter(e => e.id == id)[0]
    if (flag == true) {
      item.status = "Đã duyệt"
       BrokenReportService.update(item).then(
      res => {
        console.log(res.data)
           toast.success("Duyệt phiếu hẹn thành công")
           setListReports(prev =>
      prev.map(r => (r.id === item.id ? { ...r, status: item.status } : r))
    );
      }
    )
    }
      
    else {
      item.status = "Không duyệt"
      const result = await Swal.fire({
        title: "Bạn có chắc chắn không duyệt phiếu báo hỏng ?",
        text:
          "Phiếu sẽ được chuyển vào mục không duyệt ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Chấp nhận",
        cancelButtonText: "Hủy",
        customClass: {
          popup: "my-swal-popup",
          title: "my-swal-title",
          content: "my-swal-content",
          confirmButton: "my-swal-confirm-btn",
          cancelButton: "my-swal-cancel-btn",
        },
      });

      if (result.isConfirmed) {
      BrokenReportService.update(item).then(
          res => {
            console.log(res.data)
          toast.success("Không duyệt phiếu hẹn thành công!!!")
          setListReports(prev =>
      prev.map(r => (r.id === item.id ? { ...r, status: item.status } : r))
    );
          }
        )
      } else {
        console.log("Người dùng hủy chuyển pon");
      }
    }

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
          {users&&users.role == "Admin" && (
              <button className="btn btn-success" onClick={handleAddClick}>
            Thêm mới
          </button>
          )}
        

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
        <div style={{ overflowX: "auto" }}>
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
              <th >Thao tác</th>
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
              listReports.map((report) => (
                <tr key={report.id}>
                 
                
                  <td>{report.createdAt}</td>
                  <td>{report.userReporter}</td>
                  <td>{report.phone}</td>
                  <td>{employees.find((e) => e.id === report.employee)?.name || report.employee}</td>
                  <td>{report.startAppointment}</td>
                  <td>{report.endAppointment}</td>
                      <td>{report.reason}</td>
                        <td>{report.status}</td>
                  <td>
                    {
                      users && users.role == "Admin" ?
                        <>
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
                        </>
                        :
                        <>
                           <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleCorrect(report.id, true)}
                            >
                              Duyệt hẹn
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCorrect(report.id, false)}
                            >
                              Không duyệt
                            </button>
                          </div>
                        </>
                      
                    }
                
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </div>
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
