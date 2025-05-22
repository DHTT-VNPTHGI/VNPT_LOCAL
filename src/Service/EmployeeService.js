import axiosClient from "./Firebase"; // axios đã config baseURL Firebase

const SCHEMA = "employees";

class EmployeeService {
  // Lấy tất cả nhân viên
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
  }

  // Lấy nhân viên theo mã hoặc id (key)
  getById(id) {
    const url = `${SCHEMA}/${id}.json`;
    return axiosClient.get(url);
  }

  // Thêm nhân viên mới
  add(data) {
    // Bạn có thể push hoặc set theo id riêng
    const url = `${SCHEMA}/${data.id}.json`;
    return axiosClient.put(url, data);
  }

  // Cập nhật nhân viên
  update(data) {
    const url = `${SCHEMA}/${data.id}.json`;
    return axiosClient.patch(url, data);
  }

  // Xóa nhân viên
  delete(id) {
    const url = `${SCHEMA}/${id}.json`;
    return axiosClient.delete(url);
  }
}

export default new EmployeeService();
