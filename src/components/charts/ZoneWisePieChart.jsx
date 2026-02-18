import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { PIE_COLORS_1,PIE_COLORS_2 } from "./chartConfig";
import api from "../../services/api";

const ZoneWisePieChart = () => {
    const [data, setData] = useState([]);
    const [metric, setMetric] = useState("installations"); // installations | sales
    const [range, setRange] = useState("monthly"); // monthly | yearly
    const [loading, setLoading] = useState(false);
    const [labels,setLabels]=useState({});
    const leftLegend = data.slice(0, Math.ceil(data.length / 2));
    const rightLegend = data.slice(Math.ceil(data.length / 2));

    useEffect(() => {
        setLoading(true);
        api.getZoneWisePieChart(range).then(res => {
            setLabels(res.data.labels);
            if(!res.success) return;
            const metricData=
                metric === "sells" ? res.data.sells : res.data.installations;
            setData(metricData);
        }).catch(err => {
            console.error("ZoneWisePieChart API error:", err);
        })
            .finally(() => setLoading(false));
        }, [metric, range]);

    const colors=
        metric === "installations" ? PIE_COLORS_1 : PIE_COLORS_2;

    const pieData = {
        labels: data.map(d => d.zone),
        datasets: [
            {
                data: data.map(d => d.count),
                backgroundColor: colors,
                borderWidth: 1
            }
        ]
    };

    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                display: true
            }
        },
        animation: {
            animateRotate: true,   // ← this enables the spin
            animateScale: true,    // ← optional: scale up effect
            duration: 1000,
        },
    };

    const heading1=
         metric === "installations" ? "Zone-wise Installations" : "Zone-Wise Sells";

    const heading2=
        range==="monthly" ? labels?.lastMonthLabel : labels?.fyYearLabel;

    return (
        <div className="card shadow-sm rounded-4 ">
            <div className="card-body">

                {/* Heading */}
                <h6 className="text-center fw-bold text-secondary mb-3">
                    {heading1} ({heading2})
                </h6>

                <div className="d-flex align-items-center justify-content-between w-100">
                    {/* Left Buttons */}
                    <div className="d-flex flex-column gap-3">
                        <button
                            className={`btn btn-sm ${
                                metric === "installations"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => setMetric("installations")}
                        >
                            Installations
                        </button>

                        <button
                            className={`btn btn-sm ${
                                metric === "sells"
                                    ? "btn-secondary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => setMetric("sells")}
                        >
                            Dealer Sells
                        </button>
                    </div>

                    {/* Left Legend */}
                    <div className="d-flex flex-column gap-2 ms-3">
                        {leftLegend.map((item, i) => (
                            <div key={item.zone} className="d-flex align-items-center gap-2 small">
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: colors[i],
                                        borderRadius: "50%"
                                    }}
                                />
                                {item.zone}
                            </div>
                        ))}
                    </div>

                    {/* Pie Chart */}
                    <div style={{ width: 300, height: 300, position: "relative" }}>

                        {/* Spinner overlay — sits ON TOP, chart stays mounted */}
                        {loading && (
                            <div style={{
                                position: "absolute", inset: 0,
                                display: "flex", alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.7)",
                                zIndex: 10,
                                borderRadius: "50%"
                            }}>
                                <div className="spinner-border spinner-border-sm text-secondary" />
                            </div>
                        )}

                        <Pie
                            key={`${metric}-${range}`}
                            data={pieData}
                            options={pieOptions}
                        />
                    </div>

                    {/* Right Legend */}
                    <div className="d-flex flex-column gap-2 me-3">
                        {rightLegend.map((item, i) => (
                            <div
                                key={item.zone}
                                className="d-flex align-items-center gap-2 small"
                            >
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: colors[i + leftLegend.length],
                                        borderRadius: "50%"
                                    }}
                                />
                                {item.zone}
                            </div>
                        ))}
                    </div>

                    {/* Right Buttons */}
                    <div className="d-flex flex-column gap-3">
                        <button
                            className={`btn btn-sm ${
                                range === "monthly"
                                    ? "btn-success"
                                    : "btn-outline-success"
                            }`}
                            onClick={() => setRange("monthly")}
                        >
                            MTD
                        </button>

                        <button
                            className={`btn btn-sm ${
                                range === "yearly"
                                    ? "btn-warning"
                                    : "btn-outline-warning"
                            }`}
                            onClick={() => setRange("yearly")}
                        >
                            FY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ZoneWisePieChart;
