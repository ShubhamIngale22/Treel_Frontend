import { DashboardProvider } from "../components/context/DashboardContext";
import GlobalRangeSelector from "../components/buttons/GlobalRangeSelector";
import InstallationsTable from "../components/Tables/InstallationsTable";
import DealerInstallationsLineChart from "../components/charts/DealerInstallationsLineChart";
import ZoneWiseBarChart from "../components/charts/ZoneWiseBarChart";
import Top5TablesSection from "../components/Top5TablesSection";
const Dashboard = () => {
    return (
        <DashboardProvider>
            <div className="container-fluid bg-light min-vh-100">

                {/* Header */}
                <div
                    className="rounded-3 py-2 px-3 d-flex align-items-center gap-3 flex-wrap"
                    style={{ background: "linear-gradient(90deg,#064e3b,#16a34a,#4ade80)", boxShadow: "0 8px 20px rgba(6,78,59,0.45)", border: "1px solid rgba(6,78,59,0.35)", position: "fixed", top: 1, left: 20, right: 20, zIndex: 10 }}
                >
                    <img src="/treel_logo.png" alt="Treel Logo" className="img-fluid" style={{ height: "clamp(18px,3.5vw,28px)", width: "auto", maxWidth: "70px", flexShrink: 0 }} />
                    {/*<h4 className="text-white m-0 fw-semibold flex-grow-1 text-center" style={{ fontSize: "clamp(15px,2vw,22px)" }}>*/}
                    {/*    Smart Tyre Dashboard*/}
                    {/*</h4>*/}
                    <h4
                        className="m-0 fw-bold flex-grow-1 text-center text-white"
                        style={{
                            fontSize: "clamp(15px,2vw,22px)",
                            letterSpacing: "2px",
                            textShadow: "0 0 20px rgba(74,222,128,0.8), 0 0 40px rgba(74,222,128,0.4)",
                            textTransform: "uppercase",
                        }}
                    >
                        Smart Tyre Dashboard
                    </h4>
                    <div style={{ flexShrink: 0 }}>
                        <GlobalRangeSelector />
                    </div>
                </div>

                <div className="row g-3 px-2" style={{ paddingTop: "70px", paddingBottom: "10px" }}>

                    {/* LEFT SIDE — no state here, never re-renders from table filter */}
                    <div className="col-12 col-xxl-6 d-flex flex-column gap-2 flex-fill">
                        <div style={{ height: "270px" }}><DealerInstallationsLineChart /></div>
                        <div style={{ height: "330px" }}><ZoneWiseBarChart /></div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-12 col-xxl-6 d-flex flex-column gap-1">
                        <InstallationsTable />
                        <Top5TablesSection />  {/* ← tableRange state lives inside here */}
                    </div>

                </div>
            </div>
        </DashboardProvider>
    );
};

export default Dashboard;
