module.exports = function (sequelize, DataTypes) {
    const Score = sequelize.define("scores", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        Total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        CorrectBets: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        LastRound: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        CurrentRound: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        LastThreeRounds: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        }

    })
    /* Score.associate = (models) => {
        Score.hasOne(models.users);
    } */

    return Score;
}