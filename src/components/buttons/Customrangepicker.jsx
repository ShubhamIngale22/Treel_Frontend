import React, { useRef, useEffect, useCallback, useState } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const DATA_START = new Date(2024, 11, 23); // 23 Dec 2024 (month is 0-indexed)

// ── Generate FYs dynamically ──────────────────────────────────────────────────
const getFiscalYears = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12

    // FY starts April (month 4), so if month >= 4, current FY is currentYear-(currentYear+1)
    const latestFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;

    // Data starts Dec 2024, so first FY is 2024-25
    const firstFYStart = 2024;

    const fys = [];
    for (let y = firstFYStart; y <= latestFYStart; y++) {
        fys.push(`${y}-${String(y + 1).slice(-2)}`);
    }
    return fys;
};

export const FISCAL_YEARS = getFiscalYears();

export const ALL_MONTHS = [
    { label: "All Months", value: null  },
    { label: "April",      value: 4,  fyOffset: 1  },
    { label: "May",        value: 5,  fyOffset: 2  },
    { label: "June",       value: 6,  fyOffset: 3  },
    { label: "July",       value: 7,  fyOffset: 4  },
    { label: "August",     value: 8,  fyOffset: 5  },
    { label: "September",  value: 9,  fyOffset: 6  },
    { label: "October",    value: 10, fyOffset: 7  },
    { label: "November",   value: 11, fyOffset: 8  },
    { label: "December",   value: 12, fyOffset: 9  },
    { label: "January",    value: 1,  fyOffset: 10 },
    { label: "February",   value: 2,  fyOffset: 11 },
    { label: "March",      value: 3,  fyOffset: 12 },
];

// ── Get available months for a given FY ───────────────────────────────────────
const getAvailableMonths = (fyString) => {
    const today = new Date();
    const fyStartYear = parseInt(fyString.split("-")[0]);

    return ALL_MONTHS.filter((m) => {
        if (m.value === null) return true; // Always show "All Months"

        // Real calendar year for this month in this FY
        const calYear = m.value >= 4 ? fyStartYear : fyStartYear + 1;
        const monthDate = new Date(calYear, m.value - 1, 1);

        // Must be after data start
        if (monthDate < new Date(DATA_START.getFullYear(), DATA_START.getMonth(), 1))
            return false;

        // Must not be in the future
        if (monthDate > new Date(today.getFullYear(), today.getMonth(), 1))
            return false;

        return true;
    });
};

const VISIBLE = 5;

const getItemH = () => {
    const w = window.screen.width;
    if (w >= 3840) return 90;
    if (w >= 2560) return 50;
    if (w >= 1920) return 35;
    if (w >= 1440) return 27;
    return 25;
};
const ITEM_H = getItemH();

// ── Drum-roll scroll picker ───────────────────────────────────────────────────
function ScrollPicker({ items, selectedIndex, onChange, getLabel, disabledIndices = [] }) {
    const listRef     = useRef(null);
    const isDragging  = useRef(false);
    const startY      = useRef(0);
    const startScroll = useRef(0);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = selectedIndex * ITEM_H;
    }, [selectedIndex]);

    const snapToNearest = useCallback(() => {
        if (!listRef.current) return;
        const idx     = Math.round(listRef.current.scrollTop / ITEM_H);
        const clamped = Math.max(0, Math.min(idx, items.length - 1));
        listRef.current.scrollTop = clamped * ITEM_H;
        if (!disabledIndices.includes(clamped)) onChange(clamped);
    }, [items.length, onChange, disabledIndices]);

    const onMouseDown  = (e) => { isDragging.current = true;  startY.current = e.clientY; startScroll.current = listRef.current.scrollTop; e.preventDefault(); };
    const onMouseMove  = (e) => { if (!isDragging.current) return; listRef.current.scrollTop = startScroll.current - (e.clientY - startY.current); };
    const onMouseUp    = ()  => { isDragging.current = false; snapToNearest(); };
    const onTouchStart = (e) => { startY.current = e.touches[0].clientY; startScroll.current = listRef.current.scrollTop; };
    const onTouchMove  = (e) => { listRef.current.scrollTop = startScroll.current - (e.touches[0].clientY - startY.current); };
    const onTouchEnd   = ()  => snapToNearest();

    return (
        <div style={{ position: "relative", width: "100%", height: "90%", userSelect: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "var(--fs-custom-scroll-h)", background: "linear-gradient(to bottom, white 30%, transparent)", zIndex: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "var(--fs-custom-scroll-h)", background: "linear-gradient(to top, white 30%, transparent)", zIndex: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", height: "var(--fs-custom-scroll-h)", background: "rgba(248,215,122,0.25)", borderTop: "1.5px solid #f8d77a", borderBottom: "1.5px solid #f8d77a", borderRadius: "6px", zIndex: 1, pointerEvents: "none" }} />
            <div
                ref={listRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ height: ITEM_H * VISIBLE, overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab", position: "relative", zIndex: 0 }}
            >
                <div style={{ height: ITEM_H * 2 }} />
                {items.map((item, i) => {
                    const isSelected = i === selectedIndex;
                    const isDisabled = disabledIndices.includes(i);
                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (isDisabled) return;
                                listRef.current.scrollTop = i * ITEM_H;
                                onChange(i);
                            }}
                            style={{
                                height: ITEM_H,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isSelected ? "var(--fs-pill, 11px)" : "var(--fs-badge, 0.70rem)",
                                fontWeight: isSelected ? 600 : 400,
                                color: isDisabled ? "#e2e8f0" : isSelected ? "#92400e" : "#94a3b8",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            {getLabel(item)}
                        </div>
                    );
                })}
                <div style={{ height: ITEM_H * 2 }} />
            </div>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}

// ── CustomRangePicker ─────────────────────────────────────────────────────────
export default function CustomRangePicker({ isActive, label, onApply, buttonStyle }) {
    const [showCustom, setShowCustom] = useState(false);
    const [fyIndex,    setFyIndex]    = useState(FISCAL_YEARS.length - 1); // default latest FY
    const [monthIndex, setMonthIndex] = useState(0);
    const dropdownRef = useRef(null);

    // Available months changes when FY changes
    const availableMonths = getAvailableMonths(FISCAL_YEARS[fyIndex]);

    // When FY changes, reset month to "All Months"
    const handleFyChange = (i) => {
        setFyIndex(i);
        setMonthIndex(0);
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setShowCustom(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleApply = () => {
        onApply(fyIndex, monthIndex, FISCAL_YEARS[fyIndex], availableMonths[monthIndex]);
        setShowCustom(false);
    };

    return (
        <div className="position-relative" ref={dropdownRef}>
            <button
                onClick={() => setShowCustom((v) => !v)}
                style={{ ...buttonStyle, display: "inline-flex", alignItems: "center", gap: "5px" }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8"  y1="2" x2="8"  y2="6" />
                    <line x1="3"  y1="10" x2="21" y2="10" />
                </svg>
                {label}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                     style={{ transform: showCustom ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {showCustom && (
                <div
                    className="position-absolute bg-white border rounded-3 shadow"
                    style={{
                        top: "calc(100% + 6px)",
                        right: 0,
                        left: "auto",
                        zIndex: 100,
                        width: "var(--custom-range-w)",
                        height: "var(--custom-range-h)",
                        padding: "var(--card-p, 0.75rem)",
                    }}
                >
                    <p className="text-uppercase fw-semibold text-secondary mb-3"
                       style={{ fontSize: "var(--fs-badge, 0.70rem)", letterSpacing: "0.6px" }}>
                        Custom Range
                    </p>

                    <div className="d-flex gap-3 mb-3">
                        {/* Financial Year picker */}
                        <div style={{ flex: 1 }}>
                            <p className="text-center fw-semibold text-secondary mb-1"
                               style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                                Financial Year
                            </p>
                            <ScrollPicker
                                items={FISCAL_YEARS}
                                selectedIndex={fyIndex}
                                onChange={handleFyChange}
                                getLabel={(fy) => fy}
                            />
                        </div>

                        <div style={{ width: "1px", background: "#f1f5f9", margin: "20px 0" }} />

                        {/* Month picker — only available months */}
                        <div style={{ flex: 1 }}>
                            <p className="text-center fw-semibold text-secondary mb-1"
                               style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                                Month
                            </p>
                            <ScrollPicker
                                items={availableMonths}
                                selectedIndex={monthIndex}
                                onChange={(i) => setMonthIndex(i)}
                                getLabel={(m) => m.label}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleApply}
                        className="btn btn-warning w-100 fw-semibold"
                        style={{
                            fontSize: "var(--fs-pill, 11px)",
                            borderRadius: "8px",
                            padding: "var(--pill-py, 3px) var(--pill-px, 14px)",
                        }}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}
