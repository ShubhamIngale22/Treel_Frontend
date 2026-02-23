import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import api from "../../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const INSTALL_COLOR = "rgba(59,130,246,0.6)";
const SELLS_COLOR   = "rgba(249,115,22,0.6)";

const ZoneWiseBarChart = () => {
    const [installations, setInstallations] = useState([]);
    const [sells, setSells]                 = useState([]);
    const [range, setRange]                 = useState("monthly");
    const [loading, setLoading]             = useState(false);
    const [labels, setLabels]               = useState({});

    useEffect(() => {
        setLoading(true);
        api.getZoneWisePieChart(range)
            .then(res => {
                setLabels(res.data.labels);
                if (!res.success) return;
                setInstallations(res.data.installations ?? []);
                setSells(res.data.sells ?? []);
            })
            .catch(err => console.error("ZoneWiseBarChart API error:", err))
            .finally(() => setLoading(false));
    }, [range]);

    const zones = [...new Set([
        ...installations.map(d => d.zone),
        ...sells.map(d => d.zone),
    ])];

    const getCount = (arr, zone) => arr.find(d => d.zone === zone)?.count ?? 0;

    const barData = {
        labels: zones,
        datasets: [
            {
                label: "Installations",
                data: zones.map(z => getCount(installations, z)),
                backgroundColor: INSTALL_COLOR,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: "Dealer Sells",
                data: zones.map(z => getCount(sells, z)),
                backgroundColor: SELLS_COLOR,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: "index", intersect: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.06)" },
                ticks: { font: { size: 11 }, precision: 0 },
            },
        },
        animation: { duration: 800 },
    };

    const periodLabel = range === "monthly"
        ? labels?.lastMonthLabel
        : labels?.fyYearLabel;

    return (
        <div className="card shadow-sm rounded-4 h-100">
            <div className="card-body d-flex flex-column p-2 p-md-3">

                {/* Heading */}
                <h6 className="text-center fw-bold text-secondary mb-2 flex-shrink-0">
                    Zone-wise Installations &amp; Dealer Sells
                    {periodLabel && <span className="ms-1">({periodLabel})</span>}
                </h6>

                {/* Controls */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2 flex-shrink-0">

                    {/* Range buttons */}
                    <div className="d-flex gap-2">
                        <button
                            className={`btn btn-sm ${range === "monthly" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setRange("monthly")}
                        >
                            MTD
                        </button>
                        <button
                            className={`btn btn-sm ${range === "yearly" ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => setRange("yearly")}
                        >
                            YTD
                        </button>
                        <button
                            className={`btn btn-sm ${range === "custom" ? "btn-danger" : "btn-outline-danger"}`}
                            onClick={() => setRange("custom")}
                        >
                            Custom
                        </button>
                    </div>

                    {/* Legend pills */}
                    <div className="d-flex gap-3 align-items-center">
                        <span className="d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                            <span style={{
                                width: 12, height: 12, borderRadius: 3,
                                backgroundColor: INSTALL_COLOR, flexShrink: 0,
                            }} />
                            Installations
                        </span>
                        <span className="d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                            <span style={{
                                width: 12, height: 12, borderRadius: 3,
                                backgroundColor: SELLS_COLOR, flexShrink: 0,
                            }} />
                            Dealer Sells
                        </span>
                    </div>
                </div>

                {/* Chart */}
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
                    <Bar key={range} data={barData} options={barOptions} />
                </div>

            </div>
        </div>
    );
};

export default ZoneWiseBarChart;
