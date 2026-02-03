import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BAR_COLORS_2 } from "./chartConfig";

const TopRegionsChart = ({ uploadId }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/topRegions/${uploadId}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success) return;

                setChartData({
                    labels: res.data.labels,
                    datasets: [
                        {
                            label: "Top 5 Regions",
                            data: res.data.data,
                            backgroundColor: BAR_COLORS_2,
                            borderRadius: 6,
                            barThickness: 90
                        }
                    ]
                });
            });
    }, [uploadId]);

    if (!chartData) return <p>Loading regions chart...</p>;

    return (
        <Bar
            data={chartData}
            options={{
                responsive: true,
                maintainAspectRatio: false,

                // 👇 NEW animation config: bars grow from baseline (0) upward
                animations: {
                    y: {
                        from: (ctx) => {
                            const yScale = ctx.chart.scales.y;
                            return yScale.getPixelForValue(0); // 👈 bottom baseline
                        },
                        duration:5000,
                        delay: (ctx) => ctx.dataIndex * 300
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
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

    );
};

export default TopRegionsChart;
