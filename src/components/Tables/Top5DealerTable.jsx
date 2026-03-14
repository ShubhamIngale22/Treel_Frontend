import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { TYPE_MAP } from "../buttons/TableFilterButtons";
import TableShell from "./TableShell";

const COLUMNS = [
    { label: "Sr.",          width: "50px"                                                        },
    { label: "Dealer Shop",  minWidth: "120px", key: "dealerShopName", className: "fw-normal text-start px-2" },
    { label: "Installations",width: "70px",     render: row => row.count.toLocaleString(), className: "fw-semibold text-dark" },
];

const Top5DealerTable = ({ range, customParams = {} }) => {
    const [data,       setData]       = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const abortRef  = useRef(null);
    const tableName = "Dealers";

    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        const type = TYPE_MAP[range];
        setRefreshing(true);

        api.getTop5SmartTyreInstallation(type, tableName, type === "custom" ? customParams : {})
            .then(res => { if (!res.success) return; setData(res.data); })
            .catch(err => { if (err.name !== "CanceledError") console.error("API fetch error:", err); })
            .finally(() => setRefreshing(false));
    }, [range, customParams]);

    return (
        <TableShell
            title={`Top ${data.length} Top Dealers`}
            columns={COLUMNS}
            data={data}
            refreshing={refreshing}
        />
    );
};

export default Top5DealerTable;
