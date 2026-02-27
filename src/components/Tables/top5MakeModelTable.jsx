import { useEffect, useState } from "react";
import api from "../../services/api";

const Top5MakeModelTable = ({ range }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const tableName = "MakeModels";

    const stickyTh = {
        position: "sticky",
        top: 0,
        background: "#afd3ed",
        zIndex: 2,
        fontSize: "var(--fs-th, 0.78rem)",
        fontWeight: "600",
        padding:"var(--fs-table-p,1rem)"
    };

    useEffect(() => {
        setLoading(true);
        api.getTop5SmartTyreInstallation(range, tableName)
            .then(res => { if (!res.success) return; setData(res.data); })
            .catch(err => { console.error("Api fetch error :", err); throw err; })
            .finally(() => setLoading(false));
    }, [range, tableName]);

    return (
        <div className="card shadow-sm rounded-4 flex-fill">
            <div className="card-body" style={{ padding: "var(--card-p, 0.75rem)" }}>
                <h6
                    className="text-center fw-bold text-secondary mb-1"
                    style={{ fontSize: "var(--fs-title, 0.85rem)" }}
                >
                    Top 5 Make-Model
                </h6>

                {/* uses --top5-wide-maxh via .top5-grid .table-responsive in responsive.css */}
                <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle text-center mb-0">
                        <thead className="table-light">
                        <tr>
                            <th style={{ ...stickyTh, width: "50px" }}>Sr.</th>
                            <th style={{ ...stickyTh, maxWidth: "70px" }}>Manufacturer</th>
                            <th style={{ ...stickyTh, maxWidth: "70px" }}>Model</th>
                            <th style={{ ...stickyTh, width: "80px" }}>Installations</th>
                        </tr>
                        </thead>
                        <tbody style={{ fontSize: "var(--fs-td, 0.75rem)" }}>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-2"
                                    style={{ fontSize: "var(--fs-th, 0.78rem)" }}>
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className=" td-th-style fw-semibold">{index + 1}</td>
                                    <td className=" td-th-style fw-normal text-center px-2">{item.make}</td>
                                    <td className=" td-th-style fw-normal text-center px-2">{item.model}</td>
                                    <td className=" td-th-style fw-semibold text-dark">{item.count.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-2"
                                    style={{ fontSize: "var(--fs-th, 0.78rem)" }}>
                                    Data is not available
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Top5MakeModelTable;
