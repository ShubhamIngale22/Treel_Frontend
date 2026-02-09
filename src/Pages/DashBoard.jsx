import InstallationsTable from "../components/Tables/InstallationsTable";
import DealerInstallationsLineChart from "../components/charts/DealerInstallationsLineChart";
import Top5DealerTable from "../components/Tables/Top5DealerTable";
import Top5MakeModelTable from "../components/Tables/top5MakeModelTable";
import Top5RegionsTable from "../components/Tables/top5RegionsTable";
import ZoneWisePieChart from "../components/charts/ZoneWisePieChart";

const Dashboard = () => {
    return (
        <div className="container-fluid bg-light min-vh">

            {/* HEADER */}
            <div
                className="rounded-3 mx-2 mt-2 mb-3 py-2"
                style={{ backgroundColor: "#10b981" }}
            >
                <h4 className="text-center text-white m-0 fw-semibold">
                    TREEL Smart-Tyre Dashboard
                </h4>
            </div>

            {/* MAIN CONTENT */}
            <div
                className="row g-3 px-2"
                style={{ height: "calc(100vh - 110px)" }}
            >

                {/* LEFT SIDE – 50% */}
                <div className="col-md-6 d-flex flex-column gap-2">

                    <DealerInstallationsLineChart/>
                    <ZoneWisePieChart />

                </div>

                {/* RIGHT SIDE – 50% */}
                <div className="col-md-6 d-flex flex-column gap-2">

                    <InstallationsTable />
                    <div className="d-flex flex-row gap-2">
                        <Top5DealerTable/>
                        <Top5MakeModelTable/>
                    </div>
                    <div className="d-flex flex-row gap-2">
                        <Top5DealerTable/>
                        <Top5RegionsTable/>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

