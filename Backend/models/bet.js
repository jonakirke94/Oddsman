module.exports = function (sequelize, DataTypes) {
    const Bet = sequelize.define("bets", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        Week: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Option: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        OptionNo: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })

    Bet.associate = (models) => {
        Bet.hasOne(models.matches);
        Bet.belongsTo(models.matches);
        Bet.belongsTo(models.users);
    }
    return Bet;
}