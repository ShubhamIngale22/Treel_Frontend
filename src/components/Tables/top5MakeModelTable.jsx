import { useEffect, useState } from "react";

const Top5MakeModelTable = () => {
    const [data, setData] = useState([]);
    const stickyTh = {
        position: "sticky",
        top: 0,
        background: "#f8f9fa",
        zIndex: 2,
        fontSize: "0.75rem" // Smaller header text
    };

    useEffect(() => {
        fetch("http://localhost:5000/api/top5MakeModelTable")
            .then(res => res.json())
            .then(res => {
                if (!res.success) return;
                setData(res.data);
            });
    }, []);

    return (
        <div className="card shadow-sm rounded-4" style={{ maxWidth: "400px" }}>
            <div className="card-body p-2">
                <h6 className="text-center fw-bold text-secondary mb-1" style={{ fontSize: "0.85rem" }}>
                    Top 5 Make-Model
                </h6>

                <div className="table-responsive" style={{ maxHeight: "170px" }}>
                    <table className="table table-sm table-bordered align-middle text-center mb-0">
                        <thead className="table-light">
                        <tr>
                            <th style={{...stickyTh, width: "50px"}}>Sr.</th>
                            <th style={{...stickyTh, maxWidth: "70px"}}>Make</th>
                            <th style={{...stickyTh, maxWidth: "70px"}}>Model</th>
                            <th style={{...stickyTh, width: "80px"}}>Count</th>
                        </tr>
                        </thead>

                        <tbody style={{ fontSize: "0.8rem" }}>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="fw-semibold">{index + 1}</td>
                                    <td className="fw-normal text-center px-2" style={{ fontSize: "0.80rem" }}>
                                        {item.make}
                                    </td>
                                    <td className="fw-normal text-center px-2" style={{ fontSize: "0.80rem" }}>
                                        {item.model}
                                    </td>
                                    <td className="fw-bold text-primary">{item.count.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted py-2" style={{ fontSize: "0.75rem" }}>
                                    Loading...
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
