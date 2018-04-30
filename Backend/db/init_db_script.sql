CREATE TABLE `gotomain_net_db2`.`Users` (
  `UserId` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Tag` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  `IsAdmin` TINYINT(1) NOT NULL,
  `RefreshToken` VARCHAR(200) NULL,
  PRIMARY KEY (`UserId`));

CREATE TABLE `gotomain_net_db2`.`Tournaments` (
  `TournamentId` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Start` DATE NOT NULL,
  `End` DATE NOT NULL,
  PRIMARY KEY (`TournamentId`));

/* many to many table for tournaments and users*/
CREATE TABLE `gotomain_net_db2`.`Requests` (
  `UserId` INT NOT NULL,
  `TournamentId` INT NOT NULL,
  `Status` enum('accepted','declined', 'pending') default 'pending',
  FOREIGN KEY (UserId) REFERENCES Users (UserId),
  FOREIGN KEY (TournamentId) REFERENCES Tournaments (TournamentId),
  PRIMARY KEY (TournamentId, UserId));

