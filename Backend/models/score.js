module.exports = function (sequelize, DataTypes) {
    const Score = sequelize.define("scores", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    })
    /* Score.associate = (models) => {
        Score.hasOne(models.users);
    } */

    return Score;
}