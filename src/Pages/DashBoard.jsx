import InstallationsTable from "../components/Tables/InstallationsTable";
import DealerInstallationsLineChart from "../components/charts/DealerInstallationsLineChart";
import Top5DealerTable from "../components/Tables/Top5DealerTable";
import Top5MakeModelTable from "../components/Tables/top5MakeModelTable";
import Top5RegionsTable from "../components/Tables/top5RegionsTable";
import ZoneWisePieChart from "../components/charts/ZoneWisePieChart";
import Top5ZonesTable from "../components/Tables/top5ZonesTable";
import TableFilterButtons from "../components/Tables/TableFilterButtons";
import { useState } from "react";

const Dashboard = () => {
    const [tableRange, setTableRange] = useState("monthly");

    return (
        <div className="container-fluid bg-light min-vh-100">

            {/* Header */}
            <div
                className="rounded-3 py-2 px-3 d-flex align-items-center"
                style={{
                    background: "linear-gradient(90deg, #064e3b, #16a34a, #4ade80)",
                    boxShadow: "0 8px 20px rgba(6,78,59,0.45)",
                    border: "1px solid rgba(6,78,59,0.35)",
                    position: "fixed",
                    top: 1,
                    left: 1,
                    right: 1,
                    zIndex: 10
                }}
            >
                <img
                    src="/treel_logo.png"
                    alt="Treel Logo"
                    className="img-fluid"
                    style={{
                        height: "clamp(20px, 3.5vw, 28px)",
                        width: "auto",
                        maxWidth: "70px"
                    }}
                />
                <h4
                    className="text-center text-white m-0 fw-semibold flex-grow-1"
                    style={{ fontSize: "clamp(17px, 2.5vw, 24px)" }}
                >
                    TREEL Smart Tyre Dashboard
                </h4>
            </div>

            {/* MAIN CONTENT */}
            <div className="row g-3 px-2 pb-4px" style={{ paddingTop: "65px",paddingBottom:"15px" }}>

                {/* LEFT SIDE */}
                <div className="col-12 col-xxl-6 d-flex flex-column">
                    {/* Line chart — fixed height */}
                    <div style={{ height: 250 }}>
                        <DealerInstallationsLineChart />
                    </div>
                    {/* Pie chart — height tuned to match right side */}
                    <div style={{ height: 360 }}>
                        <ZoneWisePieChart />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-12 col-xxl-6 d-flex flex-column gap-2">

                    <InstallationsTable />

                    {/* Range Toggle Buttons — logic unchanged */}
                    <TableFilterButtons
                        tableRange={tableRange}
                        setTableRange={setTableRange}
                    />

                    {/* 4 Tables — 2-col on sm+, 1-col on xs */}
                    <div className="row g-2">
                        <div className="col-12 col-sm-6">
                            <Top5DealerTable range={tableRange} />
                        </div>
                        <div className="col-12 col-sm-6">
                            <Top5ZonesTable range={tableRange} />
                        </div>
                        <div className="col-12 col-sm-6">
                            <Top5MakeModelTable range={tableRange} />
                        </div>
                        <div className="col-12 col-sm-6">
                            <Top5RegionsTable range={tableRange} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
