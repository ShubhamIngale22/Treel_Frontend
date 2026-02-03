import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { PIE_COLORS } from "./chartConfig";


const ZonesPieChart = ({ uploadId }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/topZones/${uploadId}`)
            .then(res => res.json())
            .then(res => {
                if (!res.success) return;

                setChartData({
                    labels: res.data.labels,
                    datasets: [
                        {
                            label: "Zones Distribution",
                            data: res.data.data,
                            backgroundColor: PIE_COLORS,
                            borderWidth: 1
                        }
                    ]
                });
            });
    }, [uploadId]);

    if (!chartData) return <p>Loading zones chart...</p>;

    return <Pie
        data={chartData}
        options={{
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 3000,
                easing: "easeInOutCubic"
            },


            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }}
    />

};

export default ZonesPieChart;
