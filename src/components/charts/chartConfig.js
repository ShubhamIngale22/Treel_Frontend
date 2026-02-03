import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
    BarElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartDataLabels
);
export const CHART_COLORS = {
    primary: "#7da2f8",    // soft blue
    success: "#6fd3b2",    // soft green
    info: "#7fd6e6",       // soft cyan
    warning: "#f8d77a",    // soft yellow
    danger: "#f28b82",     // soft red
    secondary: "#b0b7c3"   // soft gray
};

export const BAR_COLORS_1 = [
    "#7da2f8",  // soft blue
    "#6fd3b2",  // soft green
    "#7fd6e6",  // soft cyan
    "#f8d77a",  // soft yellow
    "#f28b82"   // soft red
];

export const BAR_COLORS_2 = [
    "#b39ddb",  // soft purple
    "#ffb480",  // soft orange
    "#7edec5",  // soft teal
    "#8ab4f8",  // soft royal blue
    "#cfd4da"   // soft gray
];

export const PIE_COLORS = [
    "#7da2f8",
    "#6fd3b2",
    "#7fd6e6",
    "#f8d77a",
    "#f28b82",
    "#b0b7c3"
];

