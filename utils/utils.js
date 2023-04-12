var config                  = require ('../config/config.json')[process.env.NODE_ENV || 'development'];
// const { default: axios }    = require("axios")    ;


//   _  _ ___ _    ___ ___ _   _ _      ___ _   _ _  _  ___ _____ ___ ___  _  _ ___ 
//  | || | __| |  | _ \ __| | | | |    | __| | | | \| |/ __|_   _|_ _/ _ \| \| / __|
//  | __ | _|| |__|  _/ _|| |_| | |__  | _|| |_| | .` | (__  | |  | | (_) | .` \__ \
//  |_||_|___|____|_| |_|  \___/|____| |_|  \___/|_|\_|\___| |_| |___\___/|_|\_|___/
                                                                                 

// *************** HELPER FUNCIONTS ******************//
function getHeaders(form) {
  return new Promise((resolve, reject) => {
      form.getLength((err, length) => {
          if(err) { reject(err); }
          let headers = Object.assign({'Content-Length': length}, form.getHeaders());
          resolve(headers);
       });
  });
}


module.exports.getHeaders       = getHeaders  ;
