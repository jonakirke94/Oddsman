module.exports = function (sequelize, DataTypes) {
    const Tournament = sequelize.define("tournaments", {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        Start: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            },
            allowNull: false
        },
        End: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            },
            allowNull: false
        },
        Active: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false,
        }
    })

    Tournament.associate = (models) => {
        Tournament.belongsToMany(models.users, {
            through: models.users_tournaments
        }, {
            onDelete: 'cascade'
        });
        Tournament.belongsToMany(models.users, {
            through: models.requests
        }, {
            onDelete: 'cascade'
        });
        Tournament.hasMany(models.bets);
        Tournament.hasMany(models.scores);

    }

    return Tournament;
}