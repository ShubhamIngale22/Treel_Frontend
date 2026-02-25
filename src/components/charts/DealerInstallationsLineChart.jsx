import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../../services/api";
import { CHART_COLORS } from "./chartConfig";
import { useDashboard } from "../context/DashboardContext";  // ← swap import
import { MONTHS } from "../buttons/Customrangepicker"; // ← add this import

const buildChartData = (labels, installations, sells) => ({ /* unchanged */ });
const chartOptions = { /* unchanged */ };

export default function DealerInstallationsLineChart() {
    const { globalRange, customParams } = useDashboard();  // ← from context

    const [chartData, setChartData] = useState(null);
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState(null);

    // ── Chart helpers ─────────────────────────────────────────────────────────────
    const buildChartData = (labels, installations, sells) => ({
        labels,
        datasets: [
            {
                label: "Installations",
                data: installations,
                borderColor: CHART_COLORS.primary,
                backgroundColor: "rgba(125,162,248,0.15)",
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor: "#fff",
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true,
            },
            {
                label: "Sells",
                data: sells,
                borderColor: CHART_COLORS.success,
                backgroundColor: "rgba(111,211,178,0.10)",
                pointBackgroundColor: CHART_COLORS.success,
                pointBorderColor: "#fff",
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: false,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: {
                display: true,
                position: "top",
                align: "center",
                labels: {
                    usePointStyle: true,
                    pointStyleWidth: 12,
                    boxHeight: 8,
                    font: { size: 12 },
                    color: "#1c1c1b",
                    padding: 8,
                },
            },
            tooltip: {
                backgroundColor: "#1e293b",
                titleColor: "#f1f5f9",
                bodyColor: "#f1f5f9",
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString()}`,
                },
            },
            datalabels: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "#f1f5f9" },
                ticks: { color: "#94a3b8", font: { size: 10 }, callback: (v) => v.toLocaleString() },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#94a3b8", font: { size: 10 }, maxRotation: 0, autoSkip: true },
                border: { display: false },
            },
        },
    };

    // ── Fetch ─────────────────────────────────────────────────────
    useEffect(() => {
        const typeMap = {         // ← add this
            MTD: "MTD",
            YTD: "YTD",
            custom: "custom",
        };

        const params = { type: typeMap[globalRange] ?? "1year" };  // ← replace the old params line

        if (globalRange === "custom") {
            params.fiscal_year = customParams.fiscalYear;
            if (customParams.month) params.month = customParams.month;
        }

        setLoading(true);
        setError(null);

        api.getDealerInstallationsSells(params)
            .then((res) => {
                if (!res.success) { setError("Failed to load data."); return; }
                const labels        = res.data?.labels        ?? [];
                const installations = res.data?.installations ?? [];
                const sells         = res.data?.sells         ?? [];
                setChartData(buildChartData(labels, installations, sells));
            })
            .catch((err) => { console.error(err); setError("Something went wrong."); })
            .finally(() => setLoading(false));

    }, [globalRange, customParams]);

    // ── Render ────────────────────────────────────────────────────
    return (
        <div className="card shadow-sm rounded-4 h-100" style={{ overflow: "visible" }}>
            <div className="card-body d-flex flex-column p-3">

                <h6 className="text-center fw-bold text-secondary mb-2 flex-shrink-0">
                    Dealer Installations &amp; Sells performance overview
                </h6>

                {/* Chart */}
                <div style={{ height: "clamp(140px, 30vw, 190px)", flex: 1 }}>
                    {loading ? (
                        <div className="h-100 d-flex align-items-center justify-content-center gap-2">
                            <div className="spinner-border spinner-border-sm text-secondary" role="status" />
                            <span className="text-muted" style={{ fontSize: "12px" }}>Loading...</span>
                        </div>
                    ) : error ? (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            <span className="text-danger" style={{ fontSize: "12px" }}>{error}</span>
                        </div>
                    ) : chartData ? (
                        <div style={{ position: "relative", height: "98%", width: "100%" }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    ) : null}
                </div>

                {/* Active custom badge */}
                {globalRange === "custom" && (
                    <div className="d-flex align-items-center gap-1 mt-1 px-2 py-1 mb-2 rounded-2 bg-warning bg-opacity-25">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                             stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8"  y1="2" x2="8"  y2="6" />
                            <line x1="3"  y1="10" x2="21" y2="10" />
                        </svg>
                        <small style={{ fontSize: "11px", color: "#92400e" }}>
                            Showing: <strong>{customParams.fiscalYear}</strong>
                            {customParams.month && (
                                // ← find the label by matching the month number value
                                <> · <strong>{MONTHS.find(m => m.value === customParams.month)?.label}</strong></>
                            )}
                        </small>
                    </div>
                )}

            </div>
        </div>
    );
}
