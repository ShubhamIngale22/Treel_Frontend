import { useState } from "react";
import Top5DealerTable from "./Tables/Top5DealerTable";
import Top5MakeModelTable from "./Tables/top5MakeModelTable";
import Top5RegionsTable from "./Tables/top5RegionsTable";
import Top5ZonesTable from "./Tables/top5ZonesTable";
import TableFilterButtons from "./Tables/TableFilterButtons";

const Top5TablesSection = () => {
    const [tableRange, setTableRange] = useState("Finance Year"); // ← state isolated here

    return (
        <>
            <TableFilterButtons tableRange={tableRange} setTableRange={setTableRange} />
            <div className="row g-2 flex-fill">
                <div className="col-12 col-sm-6"><Top5DealerTable    range={tableRange} /></div>
                <div className="col-12 col-sm-6"><Top5ZonesTable     range={tableRange} /></div>
                <div className="col-12 col-sm-6"><Top5MakeModelTable range={tableRange} /></div>
                <div className="col-12 col-sm-6"><Top5RegionsTable   range={tableRange} /></div>
            </div>
        </>
    );
};

export default Top5TablesSection;
