var config       = require('../config/config.json')[process.env.NODE_ENV || 'development'];
var myUtils     = require('../utils/utils');
const { default: axios } = require("axios")    ;


var  serviceFunctions = {

    serv1     : async function (req){
        let resServ = {
            code   : undefined , 
            error  : undefined , 
            message: undefined
        };

        try{
            console.log (`Data received: ${req.body}`)
            const data = {
                "any":123,
            }

            const servConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url:  config.service.endpoint ,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };

            response = await axios(servConfig)
            console.log(JSON.stringify(response.data));
            resServ.message = "Servicio consumido";
            return ( resServ )
        

        } catch(error)  {
            console.error(`Error on serv1: ${error}`);
            throw (resServ);
        }

    },

}

// ************* LOCAL NEEDED FUNCTIONS ****************


module.exports = serviceFunctions;