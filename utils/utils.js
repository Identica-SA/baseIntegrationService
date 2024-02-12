var config = require("../config/config.json")[
  process.env.NODE_ENV || "development"
];

//   _  _ ___ _    ___ ___ _   _ _      ___ _   _ _  _  ___ _____ ___ ___  _  _ ___
//  | || | __| |  | _ \ __| | | | |    | __| | | | \| |/ __|_   _|_ _/ _ \| \| / __|
//  | __ | _|| |__|  _/ _|| |_| | |__  | _|| |_| | .` | (__  | |  | | (_) | .` \__ \
//  |_||_|___|____|_| |_|  \___/|____| |_|  \___/|_|\_|\___| |_| |___\___/|_|\_|___/

// *************** HELPER FUNCIONTS ******************//
function getHeaders(form) {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err);
      }
      let headers = Object.assign(
        { "Content-Length": length },
        form.getHeaders()
      );
      resolve(headers);
    });
  });
}

function sendResponseAndLogging(res, status, data) {
  logging(data);
  return res.status(status).send(data);
}

function logging(data) {
  if (data instanceof Object) {
    if (
      data.code &&
      typeof data.code === "string" &&
      data.code.endsWith("001")
    ) {
      const tagsToRemove = ["pdf", "token"];
      const newData = removeProperties(data, tagsToRemove);
      console.log(JSON.stringify(newData));
    } else console.log(JSON.stringify(data));
  } else console.log(data);
}

function error(data) {
  if (data instanceof Object) console.error(JSON.stringify(data));
  else console.error(data);
}

module.exports.logging    = logging;
module.exports.error      = error;
module.exports.getHeaders = getHeaders;
module.exports.sendResponseAndLogging = sendResponseAndLogging;
