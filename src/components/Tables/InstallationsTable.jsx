import { useEffect, useState } from "react";
import api from "../../services/api";

const InstallationsTable = () => {
    const [installationData, setInstallationData] = useState(null);
    const [sellsData, setSellsData] = useState(null);

    useEffect(() => {
        api.getInstallationSellsTable().then(res=>{
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
                            <th className={"fw-semibold"} style={{background: "#b1e0cc"}}>Yesterday</th>
                            <th className={"fw-semibold"} style={{background: "#b1e0cc"}}>Past Month</th>
                            <th className={"fw-semibold"} style={{background: "#b1e0cc"}}>Past Year</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="table-light fw-semibold" style={{background: "#b1e0cc"}} >Installations</th>
                            <td className="fw-bold text-success fs-6">
                                {installationData?.yesterday != null
                                    ? installationData.yesterday.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-bold text-success fs-6">
                                {installationData?.lastMonth != null
                                    ? installationData.lastMonth.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-bold text-success fs-6">
                                {installationData?.lastYear != null
                                    ? installationData.lastYear.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th className="table-light fw-semibold" style={{background: "#b1e0cc"}}>Dealer Sales</th>
                            <td className="fw-bold text-success fs-6">
                                {sellsData?.yesterday != null
                                    ? sellsData.yesterday.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-bold text-success fs-6">
                                {sellsData?.lastMonth != null
                                    ? sellsData.lastMonth.toLocaleString("en-IN")
                                    : "—"}
                            </td>
                            <td className="fw-bold text-success fs-6">
                                {sellsData?.lastYear != null
                                    ? sellsData.lastYear.toLocaleString("en-IN")
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
