import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
});
api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

const apiService = {

    getDealerInstallationsSells: (params) =>
        api.get("/sellsInstallationsLineChart", {
            params
        }),

    getZoneWiseBarChart: (params) =>
        api.get("/zoneWiseInstallationsSellsBarChart", {
            params
        }),

    getInstallationSellsTable: () =>
        api.get("/dealerInstallationsSellsTable"),

    getTop5SmartTyreInstallation: (range,tableName) =>
        api.get("/getTop5SmartTyreInstallation", {
            params: { type: range,filter:tableName}
        }),
};
export default apiService;
