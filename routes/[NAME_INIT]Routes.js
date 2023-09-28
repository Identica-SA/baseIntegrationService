const express = require('express'),
    router  = express.Router();
const { validationResult, check , oneOf } = require('express-validator');
var [NAME_INIT]Controllers = require('../controllers/[NAME_INIT]Controller');


// ***************** CONSTANTS ******************

// **************** ERROR CATCH *****************
process.on("uncaughtException", function (err) {
    console.error("ERROR [NAME_INIT]-ROUTES: " + err);
});

// **************** ROUTES FUNCTIONS *****************
const servRoute = async (body,res,next) => {
    try{
        var resServ = await [NAME_INIT]Controllers.servTest(body);
        var responseServ = { };
        statusCode = 500 ;
        if (!resServ) {
            responseServ.code = "[NAME_INIT]000";
            responseServ.error = "Error General";
        }
        if (typeof resServ === "string") {
            responseServ.code = "[NAME_INIT]003";
            responseServ.error = resServ;
            
        }
        // If Controller Return Error.
        if (resServ?.error){
            responseServ.code = "[NAME_INIT]004";
            responseServ.error = resServ;
        } else {
            statusCode = 200 ;
            responseServ.code = "[NAME_INIT]001";
            responseServ.message = resServ;
        }
        
        return res.status(200).json(responseServ);

    } catch (error) {
        statusCode = 500 ;
        console.error ("serv1Route SERVER ERROR " + error );
        return res.status(200).json({
            code: '[NAME_INIT]005' ,
            error: "SERV ERROR"
        })
    }
    
}


// **************** CHECK INPUT FUNCTION *****************
const checkInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
        code: '[NAME_INIT]002',
        error: errors.array()
      });
    }
    next();
};


// **************** ROUTES *****************

router.post('/serv'  , 
    check('id', 'Missing Parameter: id').exists() ,
    check('id', 'Parameter: "id" should be a COLOMBIAN Identification Number' ).
    if(check('id').exists()).isNumeric().isLength({min: 5, max:10}),

    checkInput,
    servRoute  
);


//  __   ___   _    ___ ___   _ _____ ___ ___  _  _   _____  _____ 
//  \ \ / /_\ | |  |_ _|   \ /_\_   _|_ _/ _ \| \| | | __\ \/ / __|
//   \ V / _ \| |__ | || |) / _ \| |  | | (_) | .` | | _| >  <\__ \
//    \_/_/ \_\____|___|___/_/ \_\_| |___\___/|_|\_| |___/_/\_\___/
                                                                

// // check('docDate', 'Missing Parameter: docDate').exists(),
// // check('docDate', 'The docDate field must be array dd/mm/YYYY' ).if(check('docDate').exists()).matches(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) ,

// // check('email'  , 'Missing Parameter: email').exists(),
// // check('email'  , 'Must be a string of a correct email ')
// // .if(check('email').exists()).matches(/^[A-Za-z0-9+_.-]+@(.+)+[a-zA-Z]{2,6}$/),


// // check('celular', 'Missing Parameter: celular').exists() ,
// // check('celular', 'Parameter: celular should be a COLOMBIAN phone Number' ).
// // if(check('celular').exists()).isNumeric().isLength({min: 10, max:10}),

// // // ONE OF 

// // check('user', 'Missing Parameter: user').exists(),
// // oneOf([
// //     [
// //         check('user.firstName').exists(),
// //         check('user.lastName' ).exists()
// //     ],
// //     check('user.completeName' ).exists()
// // ], 'Missing Parameter in user : (firstName and lastName) or completeName'),


// // // OPTIONALS 
// // check('city'   , 'Parameter city must be a String').isString().optional({nullable: true}),
// // check('signB64', 'Parameter signB64 must be a base64 Image').isBase64().optional({nullable: true}),
// // check('user.phone' , 'Parameter user.phone must be a Numeric').isNumeric().optional({nullable: true}),
// // check('signature.signPage'  , 'Parameter signature.signPage must be a String').isNumeric().optional({nullable: true}),

module.exports = router;