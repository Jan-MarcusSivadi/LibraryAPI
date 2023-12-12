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

    return [year, month, day].join('-');
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

    const deleteFile = async (remoteFile) => {
        return await client.deleteFile(remoteFile);
    }

    const disconnect = async () => {
        return await client.disconnect();
    }

    return { connect, getFiles, uploadFile, deleteFile, disconnect }
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