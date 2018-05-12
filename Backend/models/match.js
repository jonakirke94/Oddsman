module.exports = function (sequelize, DataTypes) {
  const Match = sequelize.define("matches", {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    MatchId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EventId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RoundId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MatchName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    MatchDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LastUpdated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Option1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Option2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Option3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Option1Odds: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Option2Odds: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Option3Odds: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Missing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    Invalid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });

  Match.associate = (models) => {
    Match.hasOne(models.results);
    Match.hasMany(models.bets);
  }

  return Match;
}