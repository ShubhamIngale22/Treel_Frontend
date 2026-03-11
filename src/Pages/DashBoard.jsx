import { DashboardProvider } from "../components/context/DashboardContext";
import InstallationsTable from "../components/Tables/InstallationsTable";
import Top5TablesSection from "../components/sections/Top5TablesSection";
import ChartsSection from "../components/sections/ChartsSection";
import DashboardHeader from "../components/DashboardHeader";

const Dashboard = () => {
    return (
        <DashboardProvider>
            <div className="dashboard-shell">
                <DashboardHeader />
                <div className="dashboard-grid">
                    <div className="dashboard-col">
                        <ChartsSection />
                    </div>
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
