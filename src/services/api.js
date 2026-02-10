const BASE_URL = "http://localhost:5000/api";
const fetchApi = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    const data = await res.json();
    return data;
};

module.exports={
    getInstallation:()=>
        fetchApi("/installationTable"),

    getTop5Dealer:()=>
        fetchApi("/top5DealerTable"),

    getTop5MakeModel:()=>
        fetchApi("/top5MakeModelTable"),

    getTop5Regions:()=>
        fetchApi("/top5regionsTable"),

    getTop5Zones:()=>
        fetchApi("/top5ZonesTable"),

    getDealerInstallations:(range)=>
        fetchApi(`/installationsLineChart?type=${range}`),

    getZoneWisePieChart:(metric,range)=>
        fetchApi(`/zone-installations?type=${range}&metric=${metric}`)

};
