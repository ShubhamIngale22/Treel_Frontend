import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const DealerInstallationsLineChart = () => {
    const [range, setRange] = useState("7days");
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/installationsLineChart?type=${range}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success) return;

                setChartData({
                    labels: res.data.labels,
                    datasets: [
                        {
                            label: "Installations",
                            data: res.data.data,
                            borderColor: "rgba(59,130,246,0.42)",
                            backgroundColor: "rgba(59,130,246,0.30)" ,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }
                    ]
                });
            });
    }, [range]);

    return (
        <div className="card shadow-sm rounded-4 ">
            <div className="card-body d-flex flex-column">

                {/* BUTTONS */}
                <div className="btn-group mb-3 align-self-center">
                    <button
                        className={`btn btn-sm ${range === "7days" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setRange("7days")}
                    >
                        7 Days
                    </button>

                    <button
                        className={`btn btn-sm ${range === "30days" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setRange("30days")}
                    >
                        30 Days
                    </button>

                    <button
                        className={`btn btn-sm ${range === "1year" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setRange("1year")}
                    >
                        1 Year
                    </button>
                </div>

                {/* LINE CHART */}
                <div style={{ height: "120px" }}>
                    {chartData ? (
                        <Line
                            data={{
                                ...chartData,
                                datasets: [
                                    {
                                        ...chartData.datasets[0],
                                        label: "Installations Trend"   // 👈 LINE NAME
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { precision: 0 }
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
