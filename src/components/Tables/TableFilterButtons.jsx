const TableFilterButtons = ({ tableRange, setTableRange }) => {
    const filters = [
        { label: "MTD",      value: "monthly",      color: "#dc3545" },
        { label: "YTD",      value: "Finance Year", color: "#198754" },
        { label: "All Time", value: "All Time",      color: "#f59e0b" },
    ];

    return (
        <div className="d-flex flex-row justify-content-around gap-2 my-1">
            {filters.map(f => {
                const isActive = tableRange === f.value;
                return (
                    <button
                        key={f.value}
                        onClick={() => setTableRange(f.value)}
                        style={{
                            border: `1.5px solid ${f.color}`,
                            backgroundColor: isActive ? f.color : "transparent",
                            color: isActive ? "#fff" : f.color,
                            borderRadius: "20px",
                            // font size and padding from CSS tokens
                            padding: "var(--pill-py, 3px) var(--pill-px, 14px)",
                            fontSize: "var(--fs-pill, 11px)",
                            fontWeight: isActive ? "600" : "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: isActive ? `0 2px 8px ${f.color}55` : "none",
                            letterSpacing: "0.3px",
                            lineHeight: 1.4,
                        }}
                        onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.backgroundColor = f.color + "15";
                        }}
                        onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
};

export default TableFilterButtons;
