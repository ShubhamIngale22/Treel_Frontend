import "../components/charts/chartConfig";
import TopDealersChart from "../components/charts/TopDealersChart";
import TopRegionsChart from "../components/charts/TopRegionsChart";
import ZonesPieChart from "../components/charts/ZonesPieChart";

const Dashboard = () => {
    const uploadId = "0ffbe5b8-6028-411b-a826-d43e1c3d1a72";

    return (
        <div className="container-fluid">
            <div
                style={{
                    backgroundColor:"#10b981",
                    color: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    margin: "8px"
                }}
            >
                <h4 className="text-center m-0">TREEL Smart-Tyre Dashboard</h4>
            </div>


            {/* Full screen fit */}
            <div
                className="row g-3"
                style={{ height: "calc(100vh - 80px)" }}
            >
                {/* LEFT – 65% */}
                <div className="col-md-8 d-flex flex-column gap-3">

                    {/* Top Dealers */}
                    <div className="card shadow-sm" style={{ height: "50%" }}>
                        <div className="card-body d-flex flex-column p-2">
                            <h6 className="text-center mb-1">Top 5 Dealers</h6>
                            <div style={{ flex: 1 }}>
                                <TopDealersChart uploadId={uploadId}/>
                            </div>
                        </div>
                    </div>

                    {/* Top Regions */}
                    <div className="card shadow-sm" style={{ height: "50%" }}>
                        <div className="card-body d-flex flex-column p-2">
                            <h6 className="text-center mb-1">Top 5 Regions</h6>
                            <div style={{ flex: 1 }}>
                                <TopRegionsChart uploadId={uploadId} />
                            </div>
                        </div>
                    </div>

                </div>


                {/* RIGHT – 35% */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h6 className="text-center">Zone Distribution</h6>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                                <ZonesPieChart uploadId={uploadId} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
