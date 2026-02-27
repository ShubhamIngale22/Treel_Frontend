import { useEffect, useState } from "react";
import api from "../../services/api";

const InstallationsTable = () => {
    const [installationData, setInstallationData] = useState(null);
    const [sellsData, setSellsData] = useState(null);
    const [labels, setLabels] = useState({});

    useEffect(() => {
        api.getInstallationSellsTable().then(res => {
            setLabels(res.data.labels);
            if (!res.success) return;
            setInstallationData(res.data.installations);
            setSellsData(res.data.sells);
        }).catch((err) => {
            console.error("Api fetch error :", err);
            throw err;
        });
    }, []);

    // All sizes via CSS tokens from responsive.css
    const thStyle = {
        background: "#b1e0cc",
        fontSize: "var(--fs-th, 0.9rem)",
        fontWeight: "600",
    };

    const tdStyle = {
        fontSize: "var(--fs-td, 0.85rem)",
        fontWeight: "600",
    };

    return (
        <div className="card shadow-sm rounded-4">
            <div className="card-body d-flex flex-column" style={{ padding: "var(--card-p, 0.75rem)" }}>
                <h6
                    className="text-center fw-bold text-secondary mb-1"
                    style={{ fontSize: "var(--fs-title, 0.85rem)" }}
                >
                    Installation Summary
                </h6>

                <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle text-center mb-0">
                        <thead className="table-light">
                        <tr className="text-secondary">
                            <th style={{ background: "#cce3d9", fontSize: "var(--fs-th, 0.78rem)" }} />
                            <th className="fw-semibold" style={thStyle}>Yesterday</th>
                            <th className="fw-semibold" style={thStyle}>{labels.lastMonthLabel}</th>
                            <th className="fw-semibold" style={thStyle}>{labels.fyYearLabel}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="table-light fw-semibold" style={thStyle}>Installations</th>
                            <td className="fw-semibold text-success" style={tdStyle}>
                                {installationData?.yesterday != null ? installationData.yesterday.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-success" style={tdStyle}>
                                {installationData?.lastMonth != null ? installationData.lastMonth.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-success" style={tdStyle}>
                                {installationData?.fyYear != null ? installationData.fyYear.toLocaleString("en-IN") : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th className="table-light fw-semibold" style={thStyle}>Dealer Sells</th>
                            <td className="fw-semibold text-success" style={tdStyle}>
                                {sellsData?.yesterday != null ? sellsData.yesterday.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-success" style={tdStyle}>
                                {sellsData?.lastMonth != null ? sellsData.lastMonth.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-success" style={tdStyle}>
                                {sellsData?.fyYear != null ? sellsData.fyYear.toLocaleString("en-IN") : "—"}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstallationsTable;
