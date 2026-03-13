// add login + token interceptor
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        //  auto logout on token expired
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

const apiService = {
    // login
    login: (data) => api.post("/loginUser", data),

    getDealerInstallationsSells: (params) =>
        api.get("/sellsInstallationsLineChart", { params }),

    getZoneWiseBarChart: (params) =>
        api.get("/zoneWiseInstallationsSellsBarChart", { params }),

    getInstallationSellsTable: () =>
        api.get("/dealerInstallationsSellsTable"),

    getTop5SmartTyreInstallation: (range, tableName, customParams = {}) =>
        api.get("/getTop5SmartTyreInstallation", {
            params: {
                type:        range,
                filter:      tableName,
                fiscal_year: customParams.fiscalYear || null,
                month:       customParams.month || null,
            }
        }),
    getRoles:  () => api.get("/getRoles"),
    getAdmins: () => api.get("/getAdmins"),
    getUsers:  () => api.get("/getUsers"),
    addUser:   (data) => api.post("/addUser", data),
    updateUser: (userId, data) => api.put(`/updateUser/${userId}`, data),
    deleteUser: (userId)       => api.delete(`/deleteUser/${userId}`),
    logout:    () => api.post("/logoutUser"),
    uploadExcel: (formData) => api.post("/uploadDealerSellExcel", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),

};

export default apiService;
