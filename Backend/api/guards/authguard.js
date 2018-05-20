const jwt = require('jsonwebtoken');
const msg = require('../../db/http');

var path = require('path');
var env = process.env.NODE_ENV || 'test';
var config  = require(path.join(__dirname, '../..', 'config', 'config.json'))[env];

const userController = require('../../controllers/user')


//read more: https://jwt.io/

module.exports = (req, res, next) => {

    //let test points pass
    if(process.env.NODE_ENV === 'test') {
        next();
    } else {

    //token is sent as "Bearer  xxxxx" so we split it to retrieve token
    const token = req.headers.authorization.split(' ');
    const ACCESS_SECRET = config.JWT_ACCESS_SECRET;
    const REFRESH_SECRET = config.JWT_REFRESH_SECRET;
   
    jwt.verify(token[1], ACCESS_SECRET, function(err, decoded) {
        //if the accesstoken has expired we fetch the user's refreshtoken and if that is valid we generate new tokens   
        if(err) {
            if(err["name"] == 'TokenExpiredError') {
                //extract user id from the JWT payload
                const decoded = jwt.verify(token[1], ACCESS_SECRET, {
                    ignoreExpiration: true
                })

                const userId = decoded.userId;
                userController.getById(userId).then(data => {
                    jwt.verify(data.RefreshToken, REFRESH_SECRET, function(err, decoded){
                        if(err) {
                            if(err["name"] == 'TokenExpiredError'){
                                //if the refreshtoken has expired too the user needs to login                           
                                return msg.show401(req, res, next);      
                            }
                            else {
                                //something else went wrong while decoding the token
                                return msg.show401(req, res, next);  
                            }
                                                      
                        }
                        if(decoded){
                            //server holds a valid refresh token
                            //inform the client that the accesstoken needs to be refreshed
                            return msg.show419(req, res);
                        }
                    });     
                })
               /*  userController.getUserByProperty('UserId', userId, function(data) {        */   
                    //check if expired else we generate new tokens
                                                                                         
              /*   }); */
            }
            else {
                //something else went wrong while decoding the token
                return msg.show401(req, res, next);
            }                                                         
        }

        if(decoded){
            next(); //valid access token
        }
    })
} 
}
