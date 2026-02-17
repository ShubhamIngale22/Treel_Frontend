import { useEffect, useState } from "react";
import api from "../../services/api";

const InstallationsTable = () => {
    const [installationData, setInstallationData] = useState(null);
    const [sellsData, setSellsData] = useState(null);
    const [labels,setLabels]=useState({});

    useEffect(() => {
        api.getInstallationSellsTable().then(res=>{
            setLabels(res.data.labels);
            if(!res.success) return;
            setInstallationData(res.data.installations);
            setSellsData(res.data.sells);

        }).catch((err)=>{
            console.error("Api fetch error :", err);
            throw err;
        })
    }, []);

    return (
        <div className="card shadow-sm rounded-4 ">
            <div className="card-body d-flex flex-column">
                <h6 className="text-center fw-bold text-secondary mb-2">
                    Installation Summary
                </h6>

                <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle text-center mb-0">
                        <thead className="table-light">
                        <tr className="text-secondary">
                            <th style={{background: "#cce3d9"}}></th>
                            <th className={"fw-semibold"} style={{background: "#b1e0cc",fontSize: "0.85rem"}}>Yesterday</th>
                            <th className={"fw-semibold"} style={{background: "#b1e0cc",fontSize: "0.85rem"}}>{labels.lastMonthLabel}</th>
                            <th className={"fw-semibold"} style={{background: "#b1e0cc",fontSize: "0.85rem"}}>{labels.fyYearLabel}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="table-light fw-semibold" style={{background: "#b1e0cc",fontSize: "0.85rem"}} >Installations</th>
                            <td className="fw-semibold text-success " style={{ fontSize: "0.9rem" }} >
                                {installationData?.yesterday != null
                                    ? installationData.yesterday.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-semibold text-success " style={{ fontSize: "0.9rem" }}>
                                {installationData?.lastMonth != null
                                    ? installationData.lastMonth.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-semibold text-success " style={{ fontSize: "0.9rem" }}>
                                {installationData?.fyYear != null
                                    ? installationData.fyYear.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th className="table-light fw-semibold" style={{background: "#b1e0cc",fontSize: "0.85rem"}}>Dealer Sells</th>
                            <td className="fw-semibold text-success" style={{ fontSize: "0.9rem" }}>
                                {sellsData?.yesterday != null
                                    ? sellsData.yesterday.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-semibold text-success" style={{ fontSize: "0.9rem" }}>
                                {sellsData?.lastMonth != null
                                    ? sellsData.lastMonth.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-semibold text-success" style={{ fontSize: "0.9rem" }}>
                                {sellsData?.fyYear != null
                                    ? sellsData.fyYear.toLocaleString("en-IN")
                                    : "—"}
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
