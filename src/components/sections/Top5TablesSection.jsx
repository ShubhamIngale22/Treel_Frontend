import { useState } from "react";
import Top5DealerTable    from "./Tables/Top5DealerTable";
import Top5MakeModelTable from "./Tables/top5MakeModelTable";
import Top5RegionsTable   from "./Tables/top5RegionsTable";
import Top5ZonesTable     from "./Tables/top5ZonesTable";
import TableFilterButtons from "./Tables/TableFilterButtons";

const Top5TablesSection = () => {
    const [tableRange,    setTableRange]    = useState("Finance Year");
    const [customParams,  setCustomParams]  = useState({});

    return (
        <div className="top5-section">
            <TableFilterButtons
                tableRange={tableRange}
                setTableRange={setTableRange}
                setCustomParams={setCustomParams}
            />
            <div className="top5-grid">
                <Top5RegionsTable   range={tableRange} customParams={customParams} />
                <Top5ZonesTable     range={tableRange} customParams={customParams} />
                <Top5MakeModelTable range={tableRange} customParams={customParams} />
                <Top5DealerTable    range={tableRange} customParams={customParams} />
            </div>
        </div>
    );
};

export default Top5TablesSection;
