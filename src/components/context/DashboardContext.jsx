import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export function DashboardProvider({ children }) {
    const [globalRange, setGlobalRange] = useState("YTD");
    // For custom: { fiscalYear: "2024-25", month: null }
    const [customParams, setCustomParams] = useState({ fiscalYear: "2024-25", month: null });

    return (
        <DashboardContext.Provider value={{ globalRange, setGlobalRange, customParams, setCustomParams }}>
            {children}
        </DashboardContext.Provider>
    );
}
