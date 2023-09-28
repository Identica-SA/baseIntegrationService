const axios = require('axios');
var utils = require('../utils/utils');

function performRequest(servConfig) {
  return new Promise((resolve, reject) => {
    const requestConfig = {
        method: method,
        url: url + endpoint,
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: {
          ...header,
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(JSON.stringify(data), 'utf8')
        },
        data: data
    };

    // utils.logging('Connecting: ' + servConfig.url + ' ' + servConfig.method);

    axios(servConfig).then((response) => {
        resolve(response);
    }).catch((err) => {
        reject(err);
    });
  });
}

exports.performRequest = performRequest;