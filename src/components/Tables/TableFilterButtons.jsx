const TableFilterButtons = ({ tableRange, setTableRange }) => {
    const filters = [
        { label: "Monthly",      value: "monthly", active: "btn-danger",  inactive: "btn-outline-danger"  },
        { label: "Financial Year", value: "Finance Year",      active: "btn-success", inactive: "btn-outline-success" },
        { label: "All Time",       value: "All Time",  active: "btn-warning", inactive: "btn-outline-warning" },
    ];

    return (
        <div className="d-flex flex-row flex-wrap justify-content-around">
            {filters.map(f => (
                <button
                    key={f.value}
                    className={`btn btn-sm ${
                        tableRange === f.value ? f.active : f.inactive
                    }`}
                    onClick={() => setTableRange(f.value)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};

export default TableFilterButtons;
