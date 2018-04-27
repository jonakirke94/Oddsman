const jwt = require('jsonwebtoken');
const msg = require('../../db/http');

//read more: https://jwt.io/

module.exports = (req, res, next) => {

    //let test points pass
    if(process.env.NODE_ENV === 'test') {
        console.log('Just testing so its ok..');
        next();
    }
   
}