import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { TYPE_MAP } from "../buttons/TableFilterButtons";
import TableShell from "./TableShell";

const COLUMNS = [
    { label: "Sr.",           width: "60px"                                                                        },
    { label: "Region Name",   minWidth: "120px", key: "regionName", className: "fw-normal text-center px-2"       },
    { label: "Installations", width: "100px",    render: row => row.count.toLocaleString(), className: "fw-semibold text-dark" },
];

const Top5RegionsTable = ({ range, customParams = {} }) => {
    const [data,       setData]       = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const abortRef  = useRef(null);
    const tableName = "Regions";

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
            title={`Top ${data.length} Regions`}
            columns={COLUMNS}
            data={data}
            refreshing={refreshing}
        />
    );
};

export default Top5RegionsTable;
