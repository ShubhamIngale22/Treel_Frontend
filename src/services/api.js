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

    getTop5Dealer: () =>
        api.get("/top5DealerInstallationTable"),

    getTop5MakeModel: () =>
        api.get("/top5MakeModelTable"),

    getTop5Regions: () =>
        api.get("/top5regionTable"),

    getTop5Zones: () =>
        api.get("/top5ZoneTable"),

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
