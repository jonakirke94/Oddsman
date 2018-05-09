module.exports = function (sequelize, DataTypes) {
    const Result = sequelize.define("results", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    })

    /* Result.associate = (models) => {
    } */

    return Result;
}