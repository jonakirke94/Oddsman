module.exports = function (sequelize, DataTypes) {
    const Request = sequelize.define("requests", {
        Status: {
            type: DataTypes.ENUM('accepted', 'declined', 'pending')
        } // Can't find the 'default' sequelize equivalent.
    })

    return Request;
};