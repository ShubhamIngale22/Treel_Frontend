import { DashboardProvider } from "../components/context/DashboardContext";
import GlobalRangeSelector from "../components/buttons/GlobalRangeSelector";
import InstallationsTable from "../components/Tables/InstallationsTable";
import DealerInstallationsLineChart from "../components/charts/DealerInstallationsLineChart";
import Top5DealerTable from "../components/Tables/Top5DealerTable";
import Top5MakeModelTable from "../components/Tables/top5MakeModelTable";
import Top5RegionsTable from "../components/Tables/top5RegionsTable";
import ZoneWisePieChart from "../components/charts/ZoneWisePieChart";
import Top5ZonesTable from "../components/Tables/top5ZonesTable";

const Dashboard = () => {
    return (
        <DashboardProvider>
            <div className="container-fluid bg-light min-vh-100">

                {/* Header */}
                <div
                    className="rounded-3 py-2 px-3 d-flex align-items-center gap-3 flex-wrap"
                    style={{ background: "linear-gradient(90deg,#064e3b,#16a34a,#4ade80)", boxShadow: "0 8px 20px rgba(6,78,59,0.45)", border: "1px solid rgba(6,78,59,0.35)", position: "fixed", top: 5, left: 20, right: 20, zIndex: 10 }}
                >
                    {/* Logo */}
                    <img src="/treel_logo.png" alt="Treel Logo" className="img-fluid" style={{ height: "clamp(20px,3.5vw,28px)", width: "auto", maxWidth: "70px", flexShrink: 0 }} />

                    {/* Title — centered */}
                    <h4 className="text-white m-0 fw-semibold flex-grow-1 text-center" style={{ fontSize: "clamp(13px,2vw,20px)" }}>
                        TREEL Smart Tyre Dashboard
                    </h4>

                    {/* Global Range Selector — right side */}
                    <div style={{ flexShrink: 0 }}>
                        <GlobalRangeSelector />
                    </div>
                </div>
                <div className="row g-3 px-2" style={{ paddingTop: "80px", paddingBottom: "15px" }}>

                    {/* LEFT SIDE */}
                    <div className="col-12 col-xxl-6 d-flex flex-column gap-2">
                        <div style={{ height: "270px" }}><DealerInstallationsLineChart /></div>
                        <div style={{ height: "330px" }}><ZoneWisePieChart /></div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-12 col-xxl-6 d-flex flex-column gap-2">
                        <InstallationsTable />
                        <div className="row g-2 flex-fill ">
                            <div className="col-12 col-sm-6 "><Top5DealerTable /></div>
                            <div className="col-12 col-sm-6 "><Top5ZonesTable /></div>
                            <div className="col-12 col-sm-6"><Top5MakeModelTable /></div>
                            <div className="col-12 col-sm-6"><Top5RegionsTable /></div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardProvider>
    );
};

export default Dashboard;
