import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../../services/api";
import { CHART_COLORS } from "../charts/chartConfig";
import CustomRangePicker, { FISCAL_YEARS, MONTHS } from "../buttons/Customrangepicker"; // ← import

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
            align: "end",
            labels: {
                usePointStyle: true,
                pointStyleWidth: 12,
                boxHeight: 8,
                font: { size: 12 },
                color: "#64748b",
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

// ── Main component ────────────────────────────────────────────────────────────
export default function DealerInstallationsLineChart() {
    const [range,             setRange]             = useState("1year");
    const [appliedFyIndex,    setAppliedFyIndex]    = useState(1);   // "2024-25"
    const [appliedMonthIndex, setAppliedMonthIndex] = useState(0);   // "All Months"
    const [chartData,         setChartData]         = useState(null);
    const [loading,           setLoading]           = useState(false);
    const [error,             setError]             = useState(null);

    const appliedFiscalYear = FISCAL_YEARS[appliedFyIndex];
    const appliedMonthObj   = MONTHS[appliedMonthIndex];
    const isCustomActive    = range === "custom";

    // Derive the button label
    const customLabel = isCustomActive
        ? appliedMonthObj.value
            ? `${appliedFiscalYear} · ${appliedMonthObj.label}`
            : appliedFiscalYear
        : "Custom";

    // ── Fetch ─────────────────────────────────────────────────────
    useEffect(() => {
        const params = { type: range };
        if (range === "custom") {
            params.fiscal_year = appliedFiscalYear;
            if (appliedMonthObj.value) params.month = appliedMonthObj.value;
        }

        setLoading(true);
        setError(null);

        api.getDealerInstallationsSells(params)
            .then((res) => {
                if (!res.success) { setError("Failed to load data."); return; }
                setChartData(buildChartData(res.data.labels, res.data.installations, res.data.sells));
            })
            .catch((err) => { console.error(err); setError("Something went wrong."); })
            .finally(() => setLoading(false));
    }, [range, appliedFiscalYear, appliedMonthObj]);

    // ── Handlers ──────────────────────────────────────────────────
    const handleRangeClick = (key) => setRange(key);

    // Called by CustomRangePicker when user hits Apply
    const handleCustomApply = (fyIndex, monthIndex) => {
        setAppliedFyIndex(fyIndex);
        setAppliedMonthIndex(monthIndex);
        setRange("custom");
    };

    // ── Render ────────────────────────────────────────────────────
    return (
        <div className="card shadow-sm rounded-4 h-100" style={{ overflow: "visible" }}>
            <div className="card-body d-flex flex-column p-3" style={{ overflow: "visible" }}>

                {/* Header */}
                <div>
                    <h6 className="text-center fw-bold text-secondary mb-3 flex-shrink-0">
                        Dealer Installations &amp; Sells performance overview
                    </h6>
                </div>

                {/* Range Buttons */}
                <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
                    {[
                        { key: "7days",  label: "7 Days"  },
                        { key: "30days", label: "30 Days" },
                        { key: "1year",  label: "1 Year"  },
                    ].map((btn) => (
                        <button
                            key={btn.key}
                            onClick={() => handleRangeClick(btn.key)}
                            className={`btn btn-sm rounded-pill px-3 ${
                                range === btn.key ? "btn-warning" : "btn-outline-secondary"
                            }`}
                            style={{ fontSize: "11px" }}
                        >
                            {btn.label}
                        </button>
                    ))}

                    {/* ← Replaced inline custom button with this */}
                    <CustomRangePicker
                        isActive={isCustomActive}
                        label={customLabel}
                        onApply={handleCustomApply}
                    />
                </div>

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
                {isCustomActive && (
                    <div className="d-flex align-items-center gap-1 mt-1 px-2 py-1 mb-2 rounded-2 bg-warning bg-opacity-25">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                             stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8"  y1="2" x2="8"  y2="6" />
                            <line x1="3"  y1="10" x2="21" y2="10" />
                        </svg>
                        <small style={{ fontSize: "11px", color: "#92400e" }}>
                            Showing: <strong>{appliedFiscalYear}</strong>
                            {appliedMonthObj.value && (
                                <> · <strong>{appliedMonthObj.label}</strong></>
                            )}
                        </small>
                    </div>
                )}

            </div>
        </div>
    );
}
