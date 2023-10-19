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
