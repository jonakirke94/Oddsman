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
      allowNull: false
    },
    MatchName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    MatchDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    LastUpdated: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Option1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Option2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Option3: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Option1Odds: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    Option2Odds: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    Option3Odds: {
      type: DataTypes.DOUBLE,
      allowNull: false
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