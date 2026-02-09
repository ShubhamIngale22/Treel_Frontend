import { useEffect, useState } from "react";

const InstallationsTable = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/installationTable")
            .then(res => res.json())
            .then(res => {
                if (!res.success) return;
                setData(res.data);
            });
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
                            <th></th>
                            <th className={"fw-semibold"}>Yesterday</th>
                            <th className={"fw-semibold"}>1 Month</th>
                            <th className={"fw-semibold"}>1 Year</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="table-light fw-semibold" >Installations</th>
                            <td className="fw-semibold text-success fs-6">
                                {data?.yesterday ?? "—"}
                            </td>
                            <td className="fw-semibold text-success fs-6">
                                {data?.lastMonth ?? "—"}
                            </td>
                            <td className="fw-semibold text-success fs-6">
                                {data?.lastYear ?? "—"}
                            </td>
                        </tr>
                        <tr>
                            <th className="table-light fw-semibold">Dealers Sale</th>
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
