import { useEffect, useState } from "react";
import api from "../../services/api";

const InstallationsTable = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.getInstallation().then(res=>{
            if(!res.success) return;
            setData(res.data)

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
                                {data?.yesterday ?? "—"}
                            </td>
                            <td className="fw-bold text-success fs-6">
                                {data?.lastMonth ?? "—"}
                            </td>
                            <td className="fw-bold text-success fs-6">
                                {data?.lastYear ?? "—"}
                            </td>
                        </tr>
                        <tr>
                            <th className="table-light fw-semibold" style={{background: "#b1e0cc"}}>Dealer Sales</th>
                            <td className="text-muted">—</td>
                            <td className="text-muted">—</td>
                            <td className="text-muted">—</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default InstallationsTable;
