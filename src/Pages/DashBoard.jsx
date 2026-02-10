import InstallationsTable from "../components/Tables/InstallationsTable";
import DealerInstallationsLineChart from "../components/charts/DealerInstallationsLineChart";
import Top5DealerTable from "../components/Tables/Top5DealerTable";
import Top5MakeModelTable from "../components/Tables/top5MakeModelTable";
import Top5RegionsTable from "../components/Tables/top5RegionsTable";
import ZoneWisePieChart from "../components/charts/ZoneWisePieChart";
import Top5ZonesTable from "../components/Tables/top5ZonesTable";

const Dashboard = () => {
    return (
        <div className="container-fluid bg-light min-vh">

            <div
                className="rounded-3 mx-2 mt-2 mb-3 py-2"
                style={{ background: "linear-gradient(90deg, #064e3b, #16a34a, #4ade80)",
                    boxShadow: "0 10px 24px rgba(6,78,59,0.45)",
                    border: "1px solid rgba(6,78,59,0.35)"}}
            >
                <h4 className="text-center text-white m-0 fw-semibold">
                    TREEL Smart-Tyre Dashboard
                </h4>
            </div>

            {/* MAIN CONTENT */}
            <div
                className="row g-3 px-2"
                style={{ height: "calc(100vh - 80px)" }}
            >

                {/* LEFT SIDE – 50% */}
                <div className="col-md-6 d-flex flex-column gap-2">

                    <DealerInstallationsLineChart/>
                    <ZoneWisePieChart />

                </div>

                {/* RIGHT SIDE – 50% */}
                <div className="col-md-6 d-flex flex-column gap-3">

                    <InstallationsTable />
                    <div className="d-flex flex-row gap-2 flex-fill">

                        <div className="d-flex flex-column gap-2 flex-fill">
                        <Top5DealerTable/>
                        <Top5MakeModelTable/>
                        </div>

                        <div className="d-flex flex-column gap-2 flex-fill">
                        <Top5ZonesTable/>
                        <Top5RegionsTable/>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;

