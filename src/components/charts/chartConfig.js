import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
    CategoryScale,
    LinearScale,

    BarElement,
    LineElement,
    PointElement,
    ArcElement,

    Tooltip,
    Legend,
    ChartDataLabels,
    Filler
);

ChartJS.defaults.plugins.datalabels = {
    display: false
};
export const CHART_COLORS = {
    primary: "#7da2f8",
    success: "#6fd3b2",
    info: "#7fd6e6",
    warning: "#f8d77a",
    danger: "#f28b82",
    secondary: "#b0b7c3"
};

export const BAR_COLORS_1 = [
    "#7da2f8",
    "#6fd3b2",
    "#7fd6e6",
    "#f8d77a",
    "#f28b82"
];

export const BAR_COLORS_2 = [
    "#b39ddb",
    "#ffb480",
    "#7edec5",
    "#8ab4f8",
    "#cfd4da"
];

export const PIE_COLORS_1 = [
    "#7da2f8",
    "#6fd3b2",
    "#7fd6e6",
    "#f8d77a",
    "#f28b82",
    "#b0b7c3",
    "#7edec5"
];

export const PIE_COLORS_2 = [
    "#f8d77a",
    "#b0b7c3",
    "#7da2f8",
    "#7edec5",
    "#f28b82",
    "#7fd6e6",
    "#6fd3b2",
];

/**
 * getChartConfig()
 *
 * Reads window.screen.width (physical screen resolution — stable, never
 * changes on resize or zoom) and returns Chart.js font sizes.
 *
 * Chart heights are NOT returned here — they are controlled by CSS
 * (.chart-line-slot / .chart-bar-slot) so Chart.js just fills the parent.
 */
export const getChartConfig = () => {
    const w = window.screen.width;

    if (w >= 3840) return { tick: 17, legend: 18 }; // 4K UHD
    if (w >= 2560) return { tick: 14, legend: 15 }; // WQHD 2K
    if (w >= 1920) return { tick: 12, legend: 13 }; // Full HD
    if (w >= 1440) return { tick: 11, legend: 12 }; // FHD+ laptop
    if (w >= 1280) return { tick: 10, legend: 11 }; // HD laptop
    return             { tick: 9,  legend: 10 };    // small / mobile
};

