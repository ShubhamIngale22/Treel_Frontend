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

    const INSTALL_COLOR = "rgba(52, 211, 153, 0.8)";  // Green
    const SELLS_COLOR   = "rgba(239, 68, 68, 0.7)";   // Red
    // All sizes via CSS tokens from responsive.css

    const tdInstallStyle = {
        background: "rgba(52, 211, 153, 0.7)",
        fontSize: "var(--fs-td, 0.85rem)",
        fontWeight: "600",
    };
    const tdSellsStyle = {
        background: "rgba(239, 68, 68, 0.6)",
        fontSize: "var(--fs-td, 0.85rem)",
        fontWeight: "600",
    };
    const thStyle = {
        background: "#afd3ed",
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
                            <th/>
                            <th className="fw-semibold" style={thStyle}>Yesterday</th>
                            <th className="fw-semibold" style={thStyle}>{labels.lastMonthLabel}</th>
                            <th className="fw-semibold" style={thStyle}>{labels.mtdLabel}</th>
                            <th className="fw-semibold" style={thStyle}>{labels.ytdLabel}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="table-light fw-semibold" style={tdInstallStyle}>Installations</th>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {installationData?.yesterday != null ? installationData.yesterday.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {installationData?.lastMonth != null ? installationData.lastMonth.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {installationData?.mtd != null ? installationData.mtd.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {installationData?.ytd != null ? installationData.ytd.toLocaleString("en-IN") : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th className="table-light fw-semibold" style={tdSellsStyle}>Dealer Sells</th>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {sellsData?.yesterday != null ? sellsData.yesterday.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {sellsData?.lastMonth != null ? sellsData.lastMonth.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {sellsData?.mtd != null ? sellsData.mtd.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="fw-semibold text-dark" style={tdStyle}>
                                {sellsData?.ytd != null ? sellsData.ytd.toLocaleString("en-IN") : "—"}
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
