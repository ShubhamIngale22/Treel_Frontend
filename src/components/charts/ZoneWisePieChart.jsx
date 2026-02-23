import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { PIE_COLORS_1, PIE_COLORS_2 } from "./chartConfig";
import api from "../../services/api";

const ZoneWisePieChart = () => {
    const [data, setData] = useState([]);
    const [metric, setMetric] = useState("installations");
    const [range, setRange] = useState("monthly");
    const [loading, setLoading] = useState(false);
    const [labels, setLabels] = useState({});

    useEffect(() => {
        setLoading(true);
        api.getZoneWisePieChart(range)
            .then(res => {
                setLabels(res.data.labels);
                if (!res.success) return;
                const metricData =
                    metric === "sells" ? res.data.sells : res.data.installations;
                setData(metricData);
            })
            .catch(err => console.error("ZoneWisePieChart API error:", err))
            .finally(() => setLoading(false));
    }, [metric, range]);

    const colors = metric === "installations" ? PIE_COLORS_1 : PIE_COLORS_2;

    const pieData = {
        labels: data.map(d => d.zone),
        datasets: [{
            data: data.map(d => d.count),
            backgroundColor: colors,
            borderWidth: 1,
        }],
    };

    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: { display: true },
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
        },
    };

    const heading1 = metric === "installations" ? "Zone-wise Installations" : "Zone-Wise Sells";
    const heading2 = range === "monthly" ? labels?.lastMonthLabel : labels?.fyYearLabel;

    return (
        <div className="card shadow-sm rounded-4 h-100">
            <div className="card-body d-flex flex-column p-2 p-md-3">

                {/* Heading */}
                <h6 className="text-center fw-bold text-secondary mb-3 mb-lg-2 flex-shrink-0">
                    {heading1} ({heading2})
                </h6>

                {/* Buttons row — MTD/FY left, Installations/Dealer Sells right */}
                <div className="d-flex justify-content-between align-items-center mb-2 gap-2 flex-shrink-0">
                    <div className="d-flex btn-group gap-2">
                        <button
                            className={`btn btn-sm ${range === "monthly" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setRange("monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            className={`btn btn-sm ${range === "yearly" ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => setRange("yearly")}
                        >
                            Financial Year
                        </button>
                    </div>
                    <div className="d-flex btn-group gap-2">
                        <button
                            className={`btn btn-sm ${metric === "installations" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setMetric("installations")}
                        >
                            Installations
                        </button>
                        <button
                            className={`btn btn-sm ${metric === "sells" ? "btn-secondary" : "btn-outline-secondary"}`}
                            onClick={() => setMetric("sells")}
                        >
                            Dealer Sells
                        </button>
                    </div>
                </div>

                {/* Pie Chart — flex-grow fills remaining card space */}
                <div style={{ position: "relative", flex: "1 1 0", minHeight: 0 }}>
                    {loading && (
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(255,255,255,0.7)", zIndex: 10,
                        }}>
                            <div className="spinner-border spinner-border-sm text-secondary" />
                        </div>
                    )}
                    <Pie key={`${metric}-${range}`} data={pieData} options={pieOptions} />
                </div>

                {/* Legend */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-2 flex-shrink-0">
                    {data.map((item, i) => (
                        <div key={item.zone} className="d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                            <span style={{
                                width: 10, height: 10,
                                backgroundColor: colors[i],
                                borderRadius: "50%", flexShrink: 0,
                            }} />
                            {item.zone}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ZoneWisePieChart;
