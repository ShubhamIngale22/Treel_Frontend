const TableShell = ({ title, columns, data, refreshing, emptyText = "Data is not available" }) => {
    return (
        <>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .stale-spinner {
                    width: 14px; height: 14px;
                    border: 2px solid #e2e8f0;
                    border-top-color: #e24731;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes fadeSwap {
                    from { opacity: 0.4; }
                    to   { opacity: 1;   }
                }
                .data-swapped {
                    animation: fadeSwap 0.3s ease-in-out;
                }
            `}</style>

            <div className="card shadow-sm rounded-4 flex-fill">
                <div className="card-body" style={{ padding: "var(--card-p, 0.75rem)" }}>

                    {/* Title + spinner */}
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                        <h6
                            className="text-center fw-bold text-secondary mb-0"
                            style={{ fontSize: "var(--fs-title, 0.85rem)" }}
                        >
                            {title}
                        </h6>
                        {refreshing && <div className="stale-spinner" />}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-sm table-bordered align-middle text-center mb-0">
                            <thead>
                            <tr>
                                {columns.map((col, i) => (
                                    <th
                                        key={i}
                                        style={{
                                            position:   "sticky",
                                            top:        0,
                                            background: "#afd3ed",
                                            zIndex:     2,
                                            fontSize:   "var(--fs-th, 0.1rem)",
                                            fontWeight: "600",
                                            padding:    "var(--fs-table-p, 1rem)",
                                            width:      col.width    || "auto",
                                            minWidth:   col.minWidth || "auto",
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody
                                className={!refreshing ? "data-swapped" : ""}
                                style={{
                                    fontSize:   "var(--fs-td, 0.75rem)",
                                    opacity:    refreshing ? 0.4 : 1,
                                    transition: "opacity 0.5s ease",
                                }}
                            >
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td className="td-th-style fw-semibold">{index + 1}</td>
                                        {columns.slice(1).map((col, i) => (
                                            <td
                                                key={i}
                                                className={`td-th-style ${col.className || ""}`}
                                            >
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center text-muted py-2"
                                        style={{ fontSize: "var(--fs-th, 0.78rem)" }}
                                    >
                                        {refreshing ? "Loading..." : emptyText}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TableShell;
