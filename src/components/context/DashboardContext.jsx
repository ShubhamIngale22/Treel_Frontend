import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export function DashboardProvider({ children }) {
    const [globalRange,   setGlobalRange]   = useState("YTD");
    // months: [] = full fiscal year, [4,5,6] = selected months
    const [customParams,  setCustomParams]  = useState({ fiscalYear: "2024-25", months: [] });

    return (
        <DashboardContext.Provider value={{ globalRange, setGlobalRange, customParams, setCustomParams }}>
            {children}
        </DashboardContext.Provider>
    );
}
