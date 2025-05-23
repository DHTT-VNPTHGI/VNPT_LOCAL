import axios from "axios";
const URL =
    "https://vnptlocal-default-rtdb.firebaseio.com";
const axiosClient = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export default axiosClient;