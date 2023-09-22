var config       = require('../config/config.json')[process.env.NODE_ENV || 'development'];
var myUtils     = require('../utils/utils');
const { default: axios } = require("axios")    ;


var  serviceFunctions = {

    servTest     : async function (req){
        let resServ = {
            code   : undefined , 
            error  : undefined , 
            message: undefined
        };

        try{

            const servConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url:  config.service.endpoint ,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data :{
                    hereBody: "Here Should be the body of the Request"
                }
            };

            response = await axios(servConfig)
            console.log(JSON.stringify(response.data));
            resServ.message = "Servicio consumido";
            return ( resServ )
        

        } catch(error)  {
            console.error(`Error on servTest: ${error}`);
            throw ("Error On Serv");
        }

    },

}

// ************* LOCAL NEEDED FUNCTIONS ****************


module.exports = serviceFunctions;