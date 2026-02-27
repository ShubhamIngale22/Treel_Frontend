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
import { useDashboard } from "../context/DashboardContext";
import { MONTHS } from "../buttons/Customrangepicker";
import { getChartConfig } from "./chartConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const INSTALL_COLOR = "rgba(52, 211, 153, 0.8)";  // Green
const SELLS_COLOR   = "rgba(239, 68, 68, 0.7)";   // Red

// Read once at module load — physical screen resolution, never changes
const { tick: tickSize } = getChartConfig();

const ZoneWiseBarChart = () => {
    const { globalRange, customParams } = useDashboard();

    const [installations, setInstallations] = useState([]);
    const [sells,         setSells]         = useState([]);
    const [labels,        setLabels]        = useState({});
    const [loading,       setLoading]       = useState(false);
    const [error,         setError]         = useState(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const params = { type: globalRange ?? "YTD" };

        if (globalRange === "custom") {
            params.fiscal_year = customParams.fiscalYear;
            if (customParams.month) params.month = customParams.month;
        }

        setLoading(true);
        setError(null);

        api.getZoneWiseBarChart(params)
            .then((res) => {
                if (!res.success) { setError("Failed to load data."); return; }
                setLabels(res.data?.labels        ?? {});
                setInstallations(res.data?.installations ?? []);
                setSells(res.data?.sells         ?? []);
            })
            .catch((err) => { console.error("ZoneWiseBarChart API error:", err); setError("Something went wrong."); })
            .finally(() => setLoading(false));
    }, [globalRange, customParams]);

    // ── Chart data ────────────────────────────────────────────────────────────
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
                borderSkipped: "bottom",
            },
            {
                label: "Dealer Sells",
                data: zones.map(z => getCount(sells, z)),
                backgroundColor: SELLS_COLOR,
                borderRadius: 4,
                borderSkipped: "bottom",
            },
        ],
    };

    // ── Chart options ─────────────────────────────────────────────────────────
    // tickSize from window.screen.width via getChartConfig()
    // Chart height NOT set here — fills .chart-bar-slot via CSS
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: "index", intersect: false },
            datalabels: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: tickSize } },   // ← from window.screen.width
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.06)" },
                ticks: { font: { size: tickSize }, precision: 0 },  // ← from window.screen.width
            },
        },
        animation: {
            duration: 2000,
            easing: "easeOutQuart",
            y: { from: (ctx) => ctx.chart.scales.y.getPixelForValue(0) },
        },
        transitions: {
            active: { animation: { duration: 400 } },
        },
    };

    const periodLabel = globalRange === "MTD"
        ? labels?.lastMonthLabel
        : labels?.fyYearLabel;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="card shadow-sm rounded-4 h-100">
            <div className="card-body d-flex flex-column" style={{ padding: "var(--card-p, 0.75rem)" }}>

                {/* Heading */}
                <h6
                    className="text-center fw-bold text-secondary mb-2 flex-shrink-0"
                    style={{ fontSize: "var(--fs-title, 0.85rem)" }}
                >
                    Zone-wise Installations &amp; Dealer Sells
                    {periodLabel && <span className="ms-1">({periodLabel})</span>}
                </h6>

                {/* Legend pills — swatch size from CSS token */}
                <div className="d-flex justify-content-center align-items-center mb-2 gap-3 flex-shrink-0">
                    <span className="d-flex align-items-center gap-1"
                          style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                        <span style={{
                            width: "var(--swatch, 11px)",
                            height: "var(--swatch, 11px)",
                            borderRadius: 3,
                            backgroundColor: INSTALL_COLOR,
                            flexShrink: 0,
                        }} />
                        Installations
                    </span>
                    <span className="d-flex align-items-center gap-1"
                          style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                        <span style={{
                            width: "var(--swatch, 11px)",
                            height: "var(--swatch, 11px)",
                            borderRadius: 3,
                            backgroundColor: SELLS_COLOR,
                            flexShrink: 0,
                        }} />
                        Dealer Sells
                    </span>
                </div>

                {/* Chart — flex:1 fills remaining card height */}
                <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
                    {loading ? (
                        <div className="h-100 d-flex align-items-center justify-content-center gap-2">
                            <div className="spinner-border spinner-border-sm text-secondary" role="status" />
                            <span className="text-muted" style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                                Loading...
                            </span>
                        </div>
                    ) : error ? (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            <span className="text-danger" style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                                {error}
                            </span>
                        </div>
                    ) : (
                        <div style={{ position: "relative", height: "98%", width: "100%" }}>
                            <Bar key={globalRange} data={barData} options={barOptions} />
                        </div>
                    )}
                </div>

                {/* Custom range badge */}
                {globalRange === "custom" && (
                    <div className="d-flex align-items-center gap-1 mt-1 px-2 py-1 mb-2 rounded-2 bg-warning bg-opacity-25">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                             stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8"  y1="2" x2="8"  y2="6" />
                            <line x1="3"  y1="10" x2="21" y2="10" />
                        </svg>
                        <small style={{ fontSize: "var(--fs-badge, 0.70rem)", color: "#92400e" }}>
                            Results for period : <strong>{customParams.fiscalYear}</strong>
                            {customParams.month && (
                                <> - <strong>{MONTHS.find(m => m.value === customParams.month)?.label}</strong></>
                            )}
                        </small>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ZoneWiseBarChart;
