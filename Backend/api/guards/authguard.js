const jwt = require('jsonwebtoken');
const msg = require('../../db/http');

//read more: https://jwt.io/

module.exports = (req, res, next) => {

    //let test points pass
    if(process.env.NODE_ENV === 'test') {
        next();
    }

    //token is sent as "Bearer  xxxxx" so we split it to retrieve token
    const token = req.headers.authorization.split(' ');
    try  {
    
    //attempt to verify token
    jwt.verify(token[1],  process.env.JWT_ACCESS_SECRET) 
    next();
    }  
     catch (error) {
        //if accesstoken has expired we fetch the user's refreshtoken and if that is valid we generate new tokens
        if(error["name"] == 'TokenExpiredError') {
            
            //extract user id from the JWT payload
             const decoded = jwt.verify(token[1],  process.env.JWT_ACCESS_SECRET, {
                ignoreExpiration: true
            })

            const userId = decoded.userId;
            users.userById(userId, function(data) {
                const refreshtoken = data.RefreshToken;
              
                try {              
                    //check if expired else we generate new tokens
                    jwt.verify(refreshtoken,  process.env.JWT_REFRESH_SECRET);
                   
                    //inform the client that the accesstoken needs to be refreshed
                    return msg.show419(req, res);
                    
                } catch(error) {
                    //if the refreshtoken has expired too the user needs to login
                    if(error["name"] == 'TokenExpiredError') {
                        return msg.show401(req, res, next); 
                    }
                }
            }, req, res);          
        } 
    }


    
    
}