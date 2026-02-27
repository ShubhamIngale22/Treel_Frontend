import { useState } from "react";
import Top5DealerTable from "./Tables/Top5DealerTable";
import Top5MakeModelTable from "./Tables/top5MakeModelTable";
import Top5RegionsTable from "./Tables/top5RegionsTable";
import Top5ZonesTable from "./Tables/top5ZonesTable";
import TableFilterButtons from "./Tables/TableFilterButtons";

const Top5TablesSection = () => {
    const [tableRange, setTableRange] = useState("Finance Year");

    return (
        // top5-section and top5-grid defined in responsive.css
        <div className="top5-section">
            <TableFilterButtons tableRange={tableRange} setTableRange={setTableRange} />
            <div className="top5-grid">
                <Top5RegionsTable   range={tableRange} />
                <Top5ZonesTable     range={tableRange} />
                <Top5MakeModelTable range={tableRange} />
                <Top5DealerTable    range={tableRange} />
            </div>
        </div>
    );
};

export default Top5TablesSection;
