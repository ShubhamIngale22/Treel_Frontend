import { useDashboard } from "../context/DashboardContext";
import CustomRangePicker from "./CustomRangePicker";

const RANGE_OPTIONS = ["MTD", "YTD"];

export default function GlobalRangeSelector() {
    const { globalRange, setGlobalRange, setCustomParams } = useDashboard();

    const handleCustomApply = (fyIndex, monthIndex, fiscalYear, monthObj) => {
        setCustomParams({ fiscalYear, month: monthObj.value });
        setGlobalRange("custom");
    };

    return (
        <div className="d-flex align-items-center justify-content-center gap-2 py-2">
            {RANGE_OPTIONS.map((key) => (
                <button
                    key={key}
                    onClick={() => setGlobalRange(key)}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                        globalRange === key
                            ? "btn-warning text-dark border-2 shadow-sm"
                            : "btn-outline-secondary text-black"
                    }`}
                    style={{ fontSize: "11px", letterSpacing: "0.4px" }}
                >
                    {key}
                </button>
            ))}

            <CustomRangePicker
                isActive={globalRange === "custom"}
                label="Custom"
                onApply={handleCustomApply}
                buttonClassName={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    globalRange === "custom"
                        ? "btn-light text-success border-2 border-light shadow-sm"
                        : "btn-outline-light text-white"
                }`}
                buttonStyle={{ fontSize: "11px", letterSpacing: "0.4px" }}
            />
        </div>
    );
}
