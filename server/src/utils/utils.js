exports.getBaseUrl = (request) => {
    return (request.connection && request.connection.encrypted ? "https" : "http") + "://" + request.headers.host
}

exports.getDateByOffset = (date, offset) => {
    // var date = new Date(start || Date.now());
    // var n = Number(offset);
    date.setDate(date.getDate() + offset)

    // date.setDate(date.getDate() + n);

    return date;
}

exports.formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
