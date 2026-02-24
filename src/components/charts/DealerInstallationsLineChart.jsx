import React, { useEffect, useRef, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import api from "../../services/api";
import { CHART_COLORS } from "../charts/chartConfig";

const FISCAL_YEARS = ["2023-24", "2024-25", "2025-26"];
const MONTHS = [
    { label: "All Months", value: null },
    { label: "April",      value: 1  },
    { label: "May",        value: 2  },
    { label: "June",       value: 3  },
    { label: "July",       value: 4  },
    { label: "August",     value: 5  },
    { label: "September",  value: 6  },
    { label: "October",    value: 7  },
    { label: "November",   value: 8  },
    { label: "December",   value: 9  },
    { label: "January",    value: 10 },
    { label: "February",   value: 11 },
    { label: "March",      value: 12 },
];

const ITEM_H = 25; // height of each scroll item in px
const VISIBLE = 5; // visible items in picker

// ── Drum-roll scroll picker ───────────────────────────────────────────────────
function ScrollPicker({ items, selectedIndex, onChange, getLabel }) {
    const listRef   = useRef(null);
    const isDragging = useRef(false);
    const startY     = useRef(0);
    const startScroll= useRef(0);

    // Scroll to selected item on mount / change
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = selectedIndex * ITEM_H;
        }
    }, [selectedIndex]);

    const snapToNearest = useCallback(() => {
        if (!listRef.current) return;
        const idx = Math.round(listRef.current.scrollTop / ITEM_H);
        const clamped = Math.max(0, Math.min(idx, items.length - 1));
        listRef.current.scrollTop = clamped * ITEM_H;
        onChange(clamped);
    }, [items.length, onChange]);

    // Mouse drag
    const onMouseDown = (e) => {
        isDragging.current = true;
        startY.current = e.clientY;
        startScroll.current = listRef.current.scrollTop;
        e.preventDefault();
    };
    const onMouseMove = (e) => {
        if (!isDragging.current) return;
        listRef.current.scrollTop = startScroll.current - (e.clientY - startY.current);
    };
    const onMouseUp = () => { isDragging.current = false; snapToNearest(); };

    // Touch drag
    const onTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
        startScroll.current = listRef.current.scrollTop;
    };
    const onTouchMove = (e) => {
        listRef.current.scrollTop = startScroll.current - (e.touches[0].clientY - startY.current);
    };
    const onTouchEnd = () => snapToNearest();

    return (
        <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
            {/* top fade */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: ITEM_H * 1.5,
                background: "linear-gradient(to bottom, white 30%, transparent)",
                zIndex: 2, pointerEvents: "none",
            }} />
            {/* bottom fade */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: ITEM_H * 1.5,
                background: "linear-gradient(to top, white 30%, transparent)",
                zIndex: 2, pointerEvents: "none",
            }} />
            {/* selection highlight */}
            <div style={{
                position: "absolute",
                top: "50%", left: 0, right: 0,
                transform: "translateY(-50%)",
                height: ITEM_H,
                background: "rgba(248,215,122,0.25)",
                borderTop: "1.5px solid #f8d77a",
                borderBottom: "1.5px solid #f8d77a",
                borderRadius: "6px",
                zIndex: 1, pointerEvents: "none",
            }} />
            {/* scrollable list */}
            <div
                ref={listRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onScroll={() => {}}
                style={{
                    height: ITEM_H * VISIBLE,      // show 5 items
                    overflowY: "scroll",
                    scrollbarWidth: "none",  // Firefox
                    msOverflowStyle: "none", // IE
                    cursor: "grab",
                    position: "relative",
                    zIndex: 0,
                }}
            >
                {/* padding top/bottom so first/last items can center */}
                <div style={{ height: ITEM_H * 2 }} />
                {items.map((item, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            listRef.current.scrollTop = i * ITEM_H;
                            onChange(i);
                        }}
                        style={{
                            height: ITEM_H,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: i === selectedIndex ? "clamp(10px, 1.5vw, 12px)" : "clamp(9px, 1.3vw, 11px)",
                            fontWeight: i === selectedIndex ? 600 : 400,
                            color: i === selectedIndex ? "#92400e" : "#94a3b8",
                            transition: "all 0.15s",
                            cursor: "pointer",
                        }}
                    >
                        {getLabel(item)}
                    </div>
                ))}
                <div style={{ height: ITEM_H * 2 }} />
            </div>
            {/* hide webkit scrollbar */}
            <style>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}

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
    interaction: {
        mode: "index",
        intersect: false,   // <-- this is the key line
    },
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
    const [range,       setRange]       = useState("1year");
    const [showCustom,  setShowCustom]  = useState(false);
    const [fyIndex,     setFyIndex]     = useState(3);          // default "2024-25"
    const [monthIndex,  setMonthIndex]  = useState(0);          // default "All Months"
    const [appliedFyIndex, setAppliedFyIndex] = useState(3);
    const [appliedMonthIndex, setAppliedMonthIndex] = useState(0);
    const [chartData,   setChartData]   = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const dropdownRef = useRef(null);

    const fiscalYear  = FISCAL_YEARS[appliedFyIndex];
    const monthObj    = MONTHS[appliedMonthIndex];

    const appliedFiscalYear = FISCAL_YEARS[appliedFyIndex];
    const appliedMonthObj   = MONTHS[appliedMonthIndex];

    // ── Fetch ─────────────────────────────────────────────────────
    useEffect(() => {
        const params = { type: range };
        if (range === "custom") {
            params.fiscal_year = fiscalYear;
            if (monthObj.value) params.month = monthObj.value;
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
    }, [range, fiscalYear, monthObj]);

    // ── Outside click ─────────────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setShowCustom(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const isCustomActive = range === "custom";

    const customLabel = isCustomActive
        ? appliedMonthObj.value
            ? `${appliedFiscalYear} · ${appliedMonthObj.label}`
            : appliedFiscalYear
        : "Custom";

    const handleRangeClick = (key) => { setRange(key); setShowCustom(false); };
    const handleApply = () => {
        setAppliedFyIndex(fyIndex);
        setAppliedMonthIndex(monthIndex);
        setRange("custom");
        setShowCustom(false);
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
                    {/* Custom Button + Dropdown */}
                    <div className="position-relative" ref={dropdownRef} style={{ zIndex: 9999 }}>
                        <button
                            onClick={() => setShowCustom((v) => !v)}
                            className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${
                                isCustomActive ? "btn-warning" : "btn-outline-secondary"
                            }`}
                            style={{ fontSize: "11px" }}
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8"  y1="2" x2="8"  y2="6" />
                                <line x1="3"  y1="10" x2="21" y2="10" />
                            </svg>
                            {customLabel}
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5"
                                 strokeLinecap="round" strokeLinejoin="round"
                                 style={{
                                     transform: showCustom ? "rotate(180deg)" : "rotate(0deg)",
                                     transition: "transform 0.2s",
                                 }}>
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Dropdown with scroll pickers */}
                        {showCustom && (
                            <div
                                className="position-absolute bg-white border rounded-3 shadow"
                                style={{
                                    top: "calc(100% + 6px)",
                                    left: 0,
                                    zIndex: 100,
                                    width: "min(280px, 90vw)",
                                    padding: "16px",
                                    transform: "translateX(min(0px, calc(100vw - 316px)))",
                                }}
                            >
                                <p className="text-uppercase fw-semibold text-secondary mb-3"
                                   style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                                    Custom Range
                                </p>

                                {/* Two-column scroll pickers */}
                                <div className="d-flex gap-3 mb-3">

                                    {/* Financial Year picker */}
                                    <div style={{ flex: 1 }}>
                                        <p className="text-center fw-semibold text-secondary mb-1" style={{ fontSize: "11px" }}>
                                            Financial Year
                                        </p>
                                        <ScrollPicker
                                            items={FISCAL_YEARS}
                                            selectedIndex={fyIndex}
                                            onChange={(i) => { setFyIndex(i); setMonthIndex(0); }}
                                            getLabel={(fy) => fy}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div style={{ width: "1px", background: "#f1f5f9", margin: "20px 0" }} />

                                    {/* Month picker */}
                                    <div style={{ flex: 1 }}>
                                        <p className="text-center fw-semibold text-secondary mb-1" style={{ fontSize: "11px" }}>
                                            Month
                                        </p>
                                        <ScrollPicker
                                            items={MONTHS}
                                            selectedIndex={monthIndex}
                                            onChange={(i) => setMonthIndex(i)}
                                            getLabel={(m) => m.label}
                                        />
                                    </div>
                                </div>

                                {/* Apply */}
                                <button
                                    onClick={handleApply}
                                    className="btn btn-warning w-100 fw-semibold"
                                    style={{ fontSize: "12px", borderRadius: "8px" }}
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chart */}
                <div style={{ height: "clamp(140px, 30vw, 190px)",flex:1}}>
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
                             stroke="#92400e" strokeWidth="2.5"
                             strokeLinecap="round" strokeLinejoin="round">
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
