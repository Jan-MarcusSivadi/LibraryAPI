exports.getBaseUrl = (request) => {
    return (request.connection && request.connection.encrypted ? "https" : "http") + "://" + request.headers.host
}

exports.stream2buffer = (stream) => {

    return new Promise((resolve, reject) => {

        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));

    });
}

exports.toObject = (arr) => {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
        rv[arr[i].name] = arr[i].value;
    return rv;
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

    // return [year, month, day].join('-');
    return [day, month, year].join('-');
}

exports.isValidDate = (s) => {
    // Assumes s is "mm/dd/yyyy"
    // const prefixWithSlashTest = /^\d\d\/\d\d\/\d\d\d\d$/.test(s)
    const prefix = '-'
    const prefixWithDashTest = /^\d\d[-]\d\d[-]\d\d\d\d$/.test(s)
    if (!prefixWithDashTest ) {
        return false;
    }
    const parts = s.split(prefix).map((p) => parseInt(p, 10));
    parts[0] -= 1;
    const d = new Date(parts[2], parts[0], parts[1]);
    return d.getMonth() === parts[0] && d.getDate() === parts[1] && d.getFullYear() === parts[2];
}

exports.connectFTPS = async (options) => {
    const FTPSClient = require('./ftps')
    const client = new FTPSClient();

    //* Open the connection
    const connect = async () => {
        return await client.connect(options);
    }
    //* List files
    const getFiles = async (dir) => {
        return await client.getFiles(dir);
    }

    const uploadFile = async (buff, dir, fileData) => {
        return await client.uploadFile(buff, dir, fileData);
    }

    const disconnect = async () => {
        return await client.disconnect();
    }

    return { connect, getFiles, uploadFile, disconnect }
}

exports.getFixedFileName = (str) => {
    return str
        .replace(' ', '63701')
        .replace('!', '46063')
        .replace('~', '33374')
        .replace('*', '81195')
        .replace('\'', '42934')
        .replace('(', '13788')
        .replace(')', '56140')
        .replace(';', '56140')
        .replace('/', '26825')
        .replace('?', '66074')
        .replace(':', '29721')
        .replace('@', '95344')
        .replace('&', '65979')
        .replace('+', '04687')
        .replace('$', '61070')
        .replace(',', '98832')
        .replace('#', '85553')
}