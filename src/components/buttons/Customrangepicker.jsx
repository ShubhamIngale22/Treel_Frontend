import React, { useRef, useEffect, useCallback, useState } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const DATA_START = new Date(2024, 11, 23);

// ── Generate FYs dynamically ──────────────────────────────────────────────────
const getFiscalYears = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const latestFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;
    const firstFYStart = 2024;
    const fys = [];
    for (let y = firstFYStart; y <= latestFYStart; y++) {
        fys.push(`${y}-${String(y + 1).slice(-2)}`);
    }
    return fys;
};

export const FISCAL_YEARS = getFiscalYears();

export const ALL_MONTHS = [
    { label: "April",     value: 4  },
    { label: "May",       value: 5  },
    { label: "June",      value: 6  },
    { label: "July",      value: 7  },
    { label: "August",    value: 8  },
    { label: "September", value: 9  },
    { label: "October",   value: 10 },
    { label: "November",  value: 11 },
    { label: "December",  value: 12 },
    { label: "January",   value: 1  },
    { label: "February",  value: 2  },
    { label: "March",     value: 3  },
];

// ── Get available months for a given FY ──────────────────────────────────────
const getAvailableMonths = (fyString) => {
    const today = new Date();
    const fyStartYear = parseInt(fyString.split("-")[0]);

    return ALL_MONTHS.filter((m) => {
        const calYear = m.value >= 4 ? fyStartYear : fyStartYear + 1;
        const monthDate = new Date(calYear, m.value - 1, 1);
        if (monthDate < new Date(DATA_START.getFullYear(), DATA_START.getMonth(), 1)) return false;
        if (monthDate > new Date(today.getFullYear(), today.getMonth(), 1)) return false;
        return true;
    });
};

const getItemH = () => {
    const w = window.screen.width;
    if (w >= 3840) return 90;
    if (w >= 2560) return 50;
    if (w >= 1920) return 35;
    if (w >= 1440) return 27;
    return 25;
};
const ITEM_H = getItemH();
const VISIBLE = 5;

// ── Drum-roll scroll picker ───────────────────────────────────────────────────
function ScrollPicker({ items, selectedIndex, onChange, getLabel }) {
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
        onChange(clamped);
    }, [items.length, onChange]);

    const onMouseDown  = (e) => { isDragging.current = true; startY.current = e.clientY; startScroll.current = listRef.current.scrollTop; e.preventDefault(); };
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
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                style={{ height: ITEM_H * VISIBLE, overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab", position: "relative", zIndex: 0 }}
            >
                <div style={{ height: ITEM_H * 2 }} />
                {items.map((item, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                        <div key={i}
                             onClick={() => { listRef.current.scrollTop = i * ITEM_H; onChange(i); }}
                             style={{ height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isSelected ? "var(--fs-pill, 11px)" : "var(--fs-badge, 0.70rem)", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#92400e" : "#94a3b8", cursor: "pointer", transition: "all 0.15s" }}
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

// ── Month chip grid — only available months shown ────────────────────────────
function MonthChips({ availableMonths, selectedMonths, onToggle, onSelectAll, onClear }) {
    return (
        <div>
            {/* Select All / Clear */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <button
                    onClick={onSelectAll}
                    style={{ fontSize: "var(--fs-badge, 0.70rem)", background: "none", border: "none", color: "#e24731", cursor: "pointer", fontWeight: 600, padding: 0 }}
                >
                    Select All
                </button>
                <button
                    onClick={onClear}
                    style={{ fontSize: "var(--fs-badge, 0.70rem)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}
                >
                    Clear
                </button>
            </div>

            {/* Month chips — only available months */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
                {ALL_MONTHS.map((m) => {
                    const isAvailable = availableMonths.some(a => a.value === m.value);
                    const isSelected  = selectedMonths.includes(m.value);

                    return (
                        <button
                            key={m.value}
                            onClick={() => isAvailable && onToggle(m.value)}
                            disabled={!isAvailable}
                            style={{
                                padding: "4px 2px",
                                fontSize: "var(--fs-badge, 0.70rem)",
                                fontWeight: isSelected ? 600 : 400,
                                border: `1.5px solid ${isSelected ? "#e24731" : isAvailable ? "#e2e8f0" : "#f1f5f9"}`,
                                borderRadius: "6px",
                                backgroundColor: isSelected ? "#e24731" : "transparent",
                                color: isSelected ? "#fff" : isAvailable ? "#64748b" : "#cbd5e1",
                                cursor: isAvailable ? "pointer" : "not-allowed",
                                transition: "all 0.15s",
                                textAlign: "center",
                            }}
                        >
                            {m.label.slice(0, 3)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── CustomRangePicker ─────────────────────────────────────────────────────────
export default function CustomRangePicker({ isActive, label, onApply, buttonStyle }) {
    const [showCustom,     setShowCustom]     = useState(false);
    const [fyIndex,        setFyIndex]        = useState(FISCAL_YEARS.length - 1);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const dropdownRef = useRef(null);

    const availableMonths = getAvailableMonths(FISCAL_YEARS[fyIndex]);

    const handleFyChange = (i) => {
        setFyIndex(i);
        setSelectedMonths([]); // reset on FY change
    };

    const handleToggle = (value) => {
        setSelectedMonths(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const handleSelectAll = () => {
        setSelectedMonths(availableMonths.map(m => m.value));
    };

    const handleClear = () => setSelectedMonths([]);

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
        const fiscalYear = FISCAL_YEARS[fyIndex];
        // selectedMonths empty = full fiscal year (no month filter)
        onApply(fiscalYear, selectedMonths);
        setShowCustom(false);
    };

    // Build display label
    const getButtonLabel = () => {
        if (!isActive) return label;
        if (selectedMonths.length === 0) return label;
        if (selectedMonths.length === 1) {
            return ALL_MONTHS.find(m => m.value === selectedMonths[0])?.label.slice(0, 3) || label;
        }
        return `${selectedMonths.length} Months`;
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
                {getButtonLabel()}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                     style={{ transform: showCustom ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {showCustom && (
                <div
                    className="position-absolute bg-white border rounded-3 shadow"
                    style={{ top: "calc(100% + 6px)", right: 0, zIndex: 100, width: "var(--custom-range-w)", padding: "var(--card-p, 0.75rem)" }}
                >
                    <p className="text-uppercase fw-semibold text-secondary mb-3"
                       style={{ fontSize: "var(--fs-badge, 0.70rem)", letterSpacing: "0.6px" }}>
                        Custom Range
                    </p>

                    <div className="d-flex gap-3 mb-3">
                        {/* Financial Year picker */}
                        <div style={{ flex: "0 0 90px" }}>
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

                        {/* Month chips */}
                        <div style={{ flex: 1 }}>
                            <p className="text-center fw-semibold text-secondary mb-1"
                               style={{ fontSize: "var(--fs-badge, 0.70rem)" }}>
                                Months
                            </p>
                            <MonthChips
                                availableMonths={availableMonths}
                                selectedMonths={selectedMonths}
                                onToggle={handleToggle}
                                onSelectAll={handleSelectAll}
                                onClear={handleClear}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleApply}
                        className="btn btn-warning w-100 fw-semibold"
                        style={{ fontSize: "var(--fs-pill, 11px)", borderRadius: "8px", padding: "var(--pill-py, 3px) var(--pill-px, 14px)" }}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}
