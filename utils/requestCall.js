const axios = require('axios')
const buffer = require('node:buffer').Buffer

const soapRequest = require('easy-soap-request');
const https = require('node:https');
// Create a custom agent to bypass SSL certificate verification
const agent = new https.Agent({
  rejectUnauthorized: false
});

const keyToRemove = ['accept', 'accept-encoding', 'connection', 'content-length', 'content-type', 'host']


async function requestCallRest(url, endpoint, method, data, header={}) {
  try {
    for (const key of keyToRemove) {
      if (Object.prototype.hasOwnProperty.call(header, key)) {
        delete header[key]
      }
    }
    const configAxios = {
      method,
      url: url + endpoint,
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {
        ...header,
        'content-type': 'application/json',
        'content-length': buffer.byteLength(JSON.stringify(data), 'utf8')
      },
      data
    }

    return await axios(configAxios)
  } catch (error) {
    throw error
  }

}


async function requestCallXml (xml, method, url) {
    try {
      const sampleHeaders = {
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': method,
      };
      const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, agent }); // Optional timeout parameter(milliseconds)
      return response;
    } catch (error) {
      throw error
    }
  }
};

module.exports = {
  requestCallRest,
  requestCallXml  
}