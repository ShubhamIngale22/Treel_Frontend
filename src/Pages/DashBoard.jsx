import { DashboardProvider } from "../components/context/DashboardContext";
import InstallationsTable from "../components/Tables/InstallationsTable";
import Top5TablesSection from "../components/Top5TablesSection";
import ChartsSection from "../components/ChartsSection";

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
                </header>

                {/* ── Body grid ── */}
                <div className="dashboard-grid">

                    {/* LEFT — charts with their own range selector */}
                    <div className="dashboard-col">
                        <ChartsSection />
                    </div>

                    {/* RIGHT — tables */}
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
