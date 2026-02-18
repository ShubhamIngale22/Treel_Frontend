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
    getInstallationSellsTable: () =>
        api.get("/dealerInstallationsSellsTable"),

    getTop5Dealer: (range) =>
        api.get("/top5DealerInstallationTable", {
            params: { type: range }
        }),

    getTop5MakeModel: (range) =>
        api.get("/top5MakeModelTable", {
            params: { type: range }
        }),

    getTop5Regions: (range) =>
        api.get("/top5regionTable", {
            params: { type: range }
        }),

    getTop5Zones: (range) =>
        api.get("/top5ZoneTable", {
            params: { type: range }
        }),

    getDealerInstallationsSells: (range) =>
        api.get("/sellsInstallationsLineChart", {
            params: { type: range }
        }),

    getZoneWisePieChart: (range) =>
        api.get("/zoneWiseInstallationsSellsPie", {
            params: { type: range }
        }),
};
export default apiService;
