function _formatVacationDate(stringDate) {
    return stringDate.split("-").reverse().join(".");
}

function buildStatusText(vacationStart, vacationEnd) {
    const start = _formatVacationDate(vacationStart);
    const end = _formatVacationDate(vacationEnd);
    return start === end
        ? `Vacation ${start}`
        : `Vacation ${start}—${end}`;
}

module.exports = { buildStatusText }