module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define("users", {
        Id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
        Name: {type: DataTypes.TEXT, allowNull: false},
        Tag: {type: DataTypes.STRING(5), unique: true, allowNull: false},
        Email: {type: DataTypes.STRING(45), validate: {isEmail: true}, allowNull: false, unique: true},
        Password: {type: DataTypes.TEXT, allowNull: false},
        IsAdmin: {type: DataTypes.TINYINT, allowNull: false},
        RefreshToken: {type: DataTypes.TEXT, allowNull: true}
    });
    
    User.associate = (models) => {
        User.belongsToMany(models.tournaments, {through: models.users_tournaments}, { onDelete: 'cascade' });
        User.belongsToMany(models.tournaments, {through: models.requests}, { onDelete: 'cascade' });
    }
    
      return User;
  };


