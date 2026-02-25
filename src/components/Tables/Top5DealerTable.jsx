import { useEffect, useState } from "react";
import api from "../../services/api";

const Top5DealerTable = ({range}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const stickyTh = {
        position: "sticky",
        top: 0,
        background: "#f8f9fa",
        zIndex: 2,
        fontSize: "0.75rem" // Smaller header text
    };
    const tableName="Dealers";

    useEffect(() => {
        setLoading(true);
        api.getTop5SmartTyreInstallation(range,tableName).then(res=>{
            if(!res.success) return;
            setData(res.data)

        }).catch((err)=>{
            console.error("Api fetch error :", err);
            throw err;
        }).finally(()=>setLoading(false));
    }, [range,tableName]);

    return (
        <div className="card shadow-sm rounded-4 flex-fill">
            <div className="card-body p-2">
                <h6 className="text-center fw-bold text-secondary mb-1" style={{ fontSize: "0.85rem" }}>
                    Top 5 Dealers
                </h6>

                <div className="table-responsive" style={{ maxHeight: "200px" }}>
                    <table className="table table-sm table-bordered align-middle text-center mb-0">
                        <thead>
                        <tr>
                            <th style={{...stickyTh, width: "50px",background: "#afd3ed"}}>Sr.</th>
                            <th style={{...stickyTh, minWidth: "120px",background: "#afd3ed"}}>Dealer Shop</th>
                            <th style={{...stickyTh, width: "70px",background: "#afd3ed"}}>Installations</th>
                        </tr>
                        </thead>

                        <tbody style={{ fontSize: "0.8rem" }}>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center text-muted py-2" style={{ fontSize: "0.75rem" }}>
                                    Loading...
                                </td>
                            </tr>
                        ):data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="fw-semibold">{index + 1}</td>
                                    <td className="fw-normal text-start px-2" style={{ fontSize: "0.70rem" }}>
                                        {item.dealerShopName}
                                    </td>
                                    <td className="fw-semibold text-dark">{item.count.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted py-2" style={{ fontSize: "0.75rem" }}>
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

export default Top5DealerTable;
