import CustomRangePicker from "./Customrangepicker";

const TYPE_MAP = {
    "MTD":      "MTD",
    "YTD":      "YTD",
    "All Time": null,
    "Custom":   "custom",
};

const filters = [
    { label: "MTD",      value: "MTD",       color: "#e24731" },
    { label: "YTD",      value: "YTD",  color: "#e24731" },
    { label: "All Time", value: "All Time",       color: "#e24731" },
];

const pillStyle = (color, isActive) => ({
    border:          `1.5px solid ${color}`,
    backgroundColor: isActive ? color : "transparent",
    color:           isActive ? "#fff" : color,
    borderRadius:    "20px",
    padding:         "var(--pill-py, 3px) var(--pill-px, 14px)",
    fontSize:        "var(--fs-pill, 11px)",
    fontWeight:      isActive ? "600" : "500",
    cursor:          "pointer",
    transition:      "all 0.2s ease",
    boxShadow:       isActive ? `0 2px 8px ${color}55` : "none",
    letterSpacing:   "0.3px",
    lineHeight:      1.4,
});

const TableFilterButtons = ({ tableRange, setTableRange, setCustomParams }) => {
    const handleCustomApply = (fyIndex, monthIndex, fiscalYear, monthObj) => {
        setCustomParams({ fiscalYear, month: monthObj.value });
        setTableRange("Custom");
    };

    return (
        <div className="card shadow-sm rounded-2 p-1">
            <div className="d-flex flex-row justify-content-around gap-2 my-1">
                {filters.map(f => {
                    const isActive = tableRange === f.value;
                    return (
                        <button
                            key={f.value}
                            onClick={() => setTableRange(f.value)}
                            style={pillStyle(f.color, isActive)}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = f.color + "15"; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                            {f.label}
                        </button>
                    );
                })}

                <CustomRangePicker
                    isActive={tableRange === "Custom"}
                    label="Custom"
                    onApply={handleCustomApply}
                    buttonStyle={pillStyle("#e24731", tableRange === "Custom")}
                />
            </div>
        </div>
    );
};

export { TYPE_MAP };
export default TableFilterButtons;
