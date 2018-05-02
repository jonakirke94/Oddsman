CREATE TABLE `gotomain_net_db2`.`Users` (
  `UserId` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Tag` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  `IsAdmin` TINYINT(1) NOT NULL,
  `RefreshToken` VARCHAR(200) NULL,
    CONSTRAINT `email_unique` UNIQUE (`Email`),
  CONSTRAINT `tag_unique` UNIQUE (`Tag`),
  PRIMARY KEY (`UserId`));

CREATE TABLE `gotomain_net_db2`.`Tournaments` (
  `TournamentId` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Start` DATE NOT NULL,
  `End` DATE NOT NULL,
  PRIMARY KEY (`TournamentId`));

/* many to many table for tournaments and users*/
CREATE TABLE `gotomain_net_db2`.`Requests` (
  `User_Id` INT NOT NULL,
  `Tournament_Id` INT NOT NULL,
  `Status` enum('accepted','declined', 'pending') default 'pending',
  FOREIGN KEY (User_Id) REFERENCES Users (UserId),
  FOREIGN KEY (Tournament_Id) REFERENCES Tournaments (TournamentId),
  PRIMARY KEY (Tournament_Id, User_Id));

/* many to many table for tournaments and users -- users enrolled in a tournament*/
  CREATE TABLE `gotomain_net_db2`.`Tournament_Users` (
  `User_Id` INT NOT NULL,
  `Tournament_Id` INT NOT NULL,
  FOREIGN KEY (User_Id) REFERENCES Users (UserId),
  FOREIGN KEY (Tournament_Id) REFERENCES Tournaments (TournamentId),
  PRIMARY KEY (Tournament_Id, User_Id));


