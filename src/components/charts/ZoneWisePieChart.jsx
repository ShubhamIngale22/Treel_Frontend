import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { PIE_COLORS } from "./chartConfig";

const ZoneWisePieChart = () => {
    const [data, setData] = useState([]);
    const [metric, setMetric] = useState("installations"); // installations | sales
    const [range, setRange] = useState("monthly"); // monthly | yearly
    const [loading, setLoading] = useState(false);
    const leftLegend = data.slice(0, Math.ceil(data.length / 2));
    const rightLegend = data.slice(Math.ceil(data.length / 2));

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);

            fetch(
                `http://localhost:5000/api/zone-installations?type=${range}&metric=${metric}`
            )
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        setData(res.data);
                    }
                })
                .finally(() => setLoading(false));
        };
        fetchData();
    }, [metric, range]);

    const pieData = {
        labels: data.map(d => d.zone),
        datasets: [
            {
                data: data.map(d => d.count),
                backgroundColor: PIE_COLORS,
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
        }
    };

    return (
        <div className="card shadow-sm rounded-4 ">
            <div className="card-body">

                {/* Heading */}
                <h6 className="text-center fw-bold text-secondary mb-3 pr-3" style={{ fontSize: "1rem" }}>
                    Zone-wise Installations an Sales
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
                                metric === "sales"
                                    ? "btn-secondary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => setMetric("sales")}
                        >
                            Dealer Sales
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
                                        backgroundColor: PIE_COLORS[i],
                                        borderRadius: "50%"
                                    }}
                                />
                                {item.zone}
                            </div>
                        ))}
                    </div>

                    {/* Pie Chart */}
                    <div style={{ width: 300, height: 300 }}>
                        {loading ? (
                            <div className="text-muted text-center small">Loading...</div>
                        ) : (
                            <Pie data={pieData} options={pieOptions} />
                        )}
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
                                        backgroundColor: PIE_COLORS[i + leftLegend.length],
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
                            YTD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ZoneWisePieChart;
