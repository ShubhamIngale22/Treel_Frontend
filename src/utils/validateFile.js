export const validateExcelFile = (file) => {
    if (!file) return "Please select a file";

    const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
        return "Only Excel files (.xls, .xlsx) are allowed";
    }

    if (file.size > 5 * 1024 * 1024) {
        return "File size must be less than 5MB";
    }

    return null;
};
