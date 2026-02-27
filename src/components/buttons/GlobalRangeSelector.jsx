import { useDashboard } from "../context/DashboardContext";
import CustomRangePicker from "./CustomRangePicker";

const RANGE_OPTIONS = ["MTD", "YTD"];

const RANGE_COLORS = {
    MTD:    "#e24731",
    YTD:    "#e24731",
    custom: "#e24731",
};

export default function GlobalRangeSelector() {
    const { globalRange, setGlobalRange, setCustomParams } = useDashboard();

    const handleCustomApply = (fyIndex, monthIndex, fiscalYear, monthObj) => {
        setCustomParams({ fiscalYear, month: monthObj.value });
        setGlobalRange("custom");
    };

    // font size and padding read from CSS tokens — scale automatically
    const pillStyle = (key, isActive) => {
        const color = RANGE_COLORS[key];
        return {
            border: `1.5px solid ${color}`,
            backgroundColor: isActive ? color : "transparent",
            color: isActive ? "#fff" : color,
            borderRadius: "20px",
            padding: "var(--pill-py, 3px) var(--pill-px, 14px)",
            margin:"var(--pill-py, 3px)",
            fontSize: "var(--fs-pill, 11px)",
            fontWeight: isActive ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: isActive ? `0 2px 8px ${color}55` : "none",
            letterSpacing: "0.4px",
            lineHeight: 1.4,
        };
    };

    return (
        <div className="d-flex align-items-center justify-content-around gap-2">
            {RANGE_OPTIONS.map((key) => {
                const isActive = globalRange === key;
                return (
                    <button
                        key={key}
                        onClick={() => setGlobalRange(key)}
                        style={pillStyle(key, isActive)}
                        onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.backgroundColor = RANGE_COLORS[key] + "15";
                        }}
                        onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        {key}
                    </button>
                );
            })}

            <CustomRangePicker
                isActive={globalRange === "custom"}
                label="Custom"
                onApply={handleCustomApply}
                buttonClassName=""
                buttonStyle={pillStyle("custom", globalRange === "custom")}
            />
        </div>
    );
}
