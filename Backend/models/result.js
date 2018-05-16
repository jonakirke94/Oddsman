module.exports = function (sequelize, DataTypes) {
    const Result = sequelize.define("results", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        EndResult: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        CorrectBet: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Missing: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    })

    /* Result.associate = (models) => {
    } */

    return Result;
}