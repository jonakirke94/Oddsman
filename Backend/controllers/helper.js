const jwtDecode = require('jwt-decode');
exports.getUserId = (req) => {
    //decode the token and fetch id
    const token = req.headers.authorization.split(' ');

    try {
        var decoded = jwtDecode(token[1])
        return decoded.userId;
    } catch (err) {
        return -1;
    }
}