module.exports = function (sequelize, DataTypes) {
    const Match = sequelize.define("matches", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    })

    Match.associate = (models) => {
        Match.hasOne(models.results);
    }

    return Match;
}