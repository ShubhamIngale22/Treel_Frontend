import React, { useRef, useEffect, useCallback, useState } from "react";

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

const ITEM_H  = 25;
const VISIBLE = 5;

// ── Drum-roll scroll picker ───────────────────────────────────────────────────
function ScrollPicker({ items, selectedIndex, onChange, getLabel }) {
    const listRef    = useRef(null);
    const isDragging = useRef(false);
    const startY     = useRef(0);
    const startScroll= useRef(0);

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

    const onMouseDown  = (e) => { isDragging.current = true;  startY.current = e.clientY; startScroll.current = listRef.current.scrollTop; e.preventDefault(); };
    const onMouseMove  = (e) => { if (!isDragging.current) return; listRef.current.scrollTop = startScroll.current - (e.clientY - startY.current); };
    const onMouseUp    = ()  => { isDragging.current = false; snapToNearest(); };
    const onTouchStart = (e) => { startY.current = e.touches[0].clientY; startScroll.current = listRef.current.scrollTop; };
    const onTouchMove  = (e) => { listRef.current.scrollTop = startScroll.current - (e.touches[0].clientY - startY.current); };
    const onTouchEnd   = ()  => snapToNearest();

    return (
        <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
            {/* top fade */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 1.5, background: "linear-gradient(to bottom, white 30%, transparent)", zIndex: 2, pointerEvents: "none" }} />
            {/* bottom fade */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 1.5, background: "linear-gradient(to top, white 30%, transparent)", zIndex: 2, pointerEvents: "none" }} />
            {/* selection highlight */}
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", height: ITEM_H, background: "rgba(248,215,122,0.25)", borderTop: "1.5px solid #f8d77a", borderBottom: "1.5px solid #f8d77a", borderRadius: "6px", zIndex: 1, pointerEvents: "none" }} />
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
                style={{ height: ITEM_H * VISIBLE, overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab", position: "relative", zIndex: 0 }}
            >
                <div style={{ height: ITEM_H * 2 }} />
                {items.map((item, i) => (
                    <div
                        key={i}
                        onClick={() => { listRef.current.scrollTop = i * ITEM_H; onChange(i); }}
                        style={{
                            height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: i === selectedIndex ? "clamp(10px, 1.5vw, 12px)" : "clamp(9px, 1.3vw, 11px)",
                            fontWeight: i === selectedIndex ? 600 : 400,
                            color: i === selectedIndex ? "#92400e" : "#94a3b8",
                            transition: "all 0.15s", cursor: "pointer",
                        }}
                    >
                        {getLabel(item)}
                    </div>
                ))}
                <div style={{ height: ITEM_H * 2 }} />
            </div>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}

// ── CustomRangePicker ─────────────────────────────────────────────────────────
/**
 * Props:
 *  - isActive      : bool   — whether "custom" range is currently selected
 *  - label         : string — button label (e.g. "Custom" or "2024-25 · April")
 *  - onApply(fyIndex, monthIndex, fiscalYear, monthObj) : called when user hits Apply
 *
 * Internal state (fyIndex, monthIndex, showDropdown) is fully self-contained.
 * The parent only needs to react to onApply.
 */
export default function CustomRangePicker({ isActive, label, onApply }) {
    const [showCustom,  setShowCustom]  = useState(false);
    const [fyIndex,     setFyIndex]     = useState(1);   // default "2024-25"
    const [monthIndex,  setMonthIndex]  = useState(0);   // default "All Months"
    const dropdownRef = useRef(null);

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
        onApply(fyIndex, monthIndex, FISCAL_YEARS[fyIndex], MONTHS[monthIndex]);
        setShowCustom(false);
    };

    return (
        <div className="position-relative" ref={dropdownRef} style={{ zIndex: 9999 }}>
            {/* Trigger button */}
            <button
                onClick={() => setShowCustom((v) => !v)}
                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${isActive ? "btn-warning" : "btn-outline-secondary"}`}
                style={{ fontSize: "11px" }}
            >
                {/* Calendar icon */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8"  y1="2" x2="8"  y2="6" />
                    <line x1="3"  y1="10" x2="21" y2="10" />
                </svg>
                {label}
                {/* Chevron */}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                     style={{ transform: showCustom ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown */}
            {showCustom && (
                <div
                    className="position-absolute bg-white border rounded-3 shadow"
                    style={{ top: "calc(100% + 6px)", left: 0, zIndex: 100, width: "min(280px, 90vw)", padding: "16px", transform: "translateX(min(0px, calc(100vw - 316px)))" }}
                >
                    <p className="text-uppercase fw-semibold text-secondary mb-3" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                        Custom Range
                    </p>

                    <div className="d-flex gap-3 mb-3">
                        {/* Financial Year picker */}
                        <div style={{ flex: 1 }}>
                            <p className="text-center fw-semibold text-secondary mb-1" style={{ fontSize: "11px" }}>Financial Year</p>
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
                            <p className="text-center fw-semibold text-secondary mb-1" style={{ fontSize: "11px" }}>Month</p>
                            <ScrollPicker
                                items={MONTHS}
                                selectedIndex={monthIndex}
                                onChange={(i) => setMonthIndex(i)}
                                getLabel={(m) => m.label}
                            />
                        </div>
                    </div>

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
    );
}
export { FISCAL_YEARS, MONTHS };
