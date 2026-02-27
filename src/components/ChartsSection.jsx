import GlobalRangeSelector from "./buttons/GlobalRangeSelector";
import DealerInstallationsLineChart from "./charts/DealerInstallationsLineChart";
import ZoneWiseBarChart from "./charts/ZoneWiseBarChart";

const ChartsSection = () => {
    return (
        <div className="charts-section">
            <div className="card shadow-sm rounded-2 p-1">
                <GlobalRangeSelector />
            </div>
            <div className="chart-line-slot">
                <DealerInstallationsLineChart />
            </div>
            <div className="chart-bar-slot">
                <ZoneWiseBarChart />
            </div>
        </div>
    );
};

export default ChartsSection;
