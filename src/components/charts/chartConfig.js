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

export const PIE_COLORS = [
    "#7da2f8",
    "#6fd3b2",
    "#7fd6e6",
    "#f8d77a",
    "#f28b82",
    "#b0b7c3",
    "#7edec5"
];
