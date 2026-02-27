import { DashboardProvider } from "../components/context/DashboardContext";
import GlobalRangeSelector from "../components/buttons/GlobalRangeSelector";
import InstallationsTable from "../components/Tables/InstallationsTable";
import DealerInstallationsLineChart from "../components/charts/DealerInstallationsLineChart";
import ZoneWiseBarChart from "../components/charts/ZoneWiseBarChart";
import Top5TablesSection from "../components/Top5TablesSection";

const Dashboard = () => {
    return (
        <DashboardProvider>
            <div className="dashboard-shell">

                {/* ── Header ── */}
                <header className="dashboard-header">
                    <img
                        src="/treel_logo.png"
                        alt="Treel Logo"
                        className="dashboard-logo"
                    />
                    <h4 className="dashboard-title">Smart Tyre Dashboard</h4>
                    <div className="dashboard-range">
                        <GlobalRangeSelector />
                    </div>
                </header>

                {/* ── Body grid ── */}
                <div className="dashboard-grid">

                    {/* LEFT — charts, isolated from table filter re-renders */}
                    <div className="dashboard-col">
                        <div className="chart-line-slot">
                            <DealerInstallationsLineChart />
                        </div>
                        <div className="chart-bar-slot">
                            <ZoneWiseBarChart />
                        </div>
                    </div>

                    {/* RIGHT — summary table + Top 5 */}
                    <div className="dashboard-col">
                        <InstallationsTable />
                        <Top5TablesSection />
                    </div>

                </div>
            </div>
        </DashboardProvider>
    );
};

export default Dashboard;
