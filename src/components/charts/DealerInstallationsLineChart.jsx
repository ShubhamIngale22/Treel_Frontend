import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../../services/api";

// const LINE_STYLE = {
//     borderColor: "rgba(59,130,246,0.42)",
//     backgroundColor: "rgba(59,130,246,0.30)",
//     tension: 0.4,
//     fill: true,
//     pointRadius: 4,
//     pointHoverRadius: 6
// };
const DealerInstallationsLineChart = () => {
    const [range, setRange] = useState("1year");
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        api.getDealerInstallationsSells(range).then(res => {
                if (!res.success) return;
            setChartData({
                labels: res.data.labels,
                datasets: [
                    {
                        label: "Installations",
                        data: res.data.installations,
                        borderColor: "#3b82f6",
                        backgroundColor: "rgba(59,130,246,0.2)",
                        tension: 0.4,
                        fill: true,
                    },
                    {
                        label: "Sells",
                        data: res.data.sells,
                        borderColor: "#f97316",
                        backgroundColor: "rgba(249,115,22,0.2)",
                        tension: 0.4,
                        fill: false,
                    }
                ]
            });
            }).catch((err)=>{
            console.error("Api fetch error :", err);
            throw err;
        })
    }, [range]);

    return (
        <div className="card shadow-sm rounded-4">
            <div className="card-body d-flex flex-column">

                {/* BUTTONS */}
                <div className="btn-group mb-2 align-self-center">
                    <button
                        className={`btn btn-sm m-1 ${range === "7days" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setRange("7days")}
                    >
                        7 Days
                    </button>

                    <button
                        className={`btn btn-sm m-1 ${range === "30days" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setRange("30days")}
                    >
                        30 Days
                    </button>

                    <button
                        className={`btn btn-sm m-1 ${range === "1year" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setRange("1year")}
                    >
                        1 Year
                    </button>
                </div>

                {/* LINE CHART */}
                <div style={{height:"150px"}}>
                    {chartData ? (
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: "top",
                                        labels: {
                                            usePointStyle: true
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return context.dataset.label + ": " +
                                                    context.raw.toLocaleString();
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function(value) {
                                                return value.toLocaleString();
                                            }
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            maxRotation: 0,
                                            autoSkip: true
                                        }
                                    }
                                }
                            }}

                        />
                    ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                            Loading chart...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DealerInstallationsLineChart;
