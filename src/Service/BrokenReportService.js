import axiosClient from "./Firebase"; // axios đã config baseURL Firebase

const SCHEMA = "brokenReports";

class BrokenReportService {
  // Lấy tất cả báo hỏng
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
  }

  // Lấy báo hỏng theo ngày (giả sử dùng key ngày)
  getByDate(date) {
    const url = `${SCHEMA}/${date}.json`;
    return axiosClient.get(url);
  }

  // Cập nhật báo hỏng theo username hoặc id
  update(data) {
    const url = `/${SCHEMA}/${data.id}.json`;
    return axiosClient.patch(url, data);
  }

  // Xóa báo hỏng theo id
  delete(data) {
    const url = `/${SCHEMA}/${data.id}.json`;
    return axiosClient.delete(url);
  }

  // Thêm mới báo hỏng
  add(data) {
    const url = `${SCHEMA}.json`;
    return axiosClient.post(url, data);
  }
}

export default new BrokenReportService();
