CREATE TABLE IF NOT EXISTS jungleUser(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    isAdmin bit DEFAULT 0,
    name varchar(255) NOT NULL,
    surname varchar(255) NUll,
    image varchar(255) NULL,
    email varchar(255) NOT NULL,
    phone varchar (20),
    canSendNews bit DEFAULT 0,
    password varchar(255) NOT NUll
);

CREATE TABLE IF NOT EXISTS refreshTokens(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    userId int(10) NOT NULL,
    token varchar(255) NOT NULL,

    FOREIGN KEY (userId) REFERENCES jungleUser(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS child(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    userId int(10) NOT NULL,
    name varchar(255) NOT NULL,
    image varchar(255) NULL,
    surname varchar(255) NUll,
    dateOfBirth date NOT NULL,
    
    FOREIGN KEY (userId) REFERENCES jungleUser(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    childId int(10) NOT NULL,
    text text NOT NULL,
    isSeen bit DEFAULT 0,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (childId) REFERENCES child(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    userId int(10) NOT NULL,
    theme varchar(255) NOT NULL,
    text text NOT NULL,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `messages` ADD FOREIGN KEY (`userId`) REFERENCES `jungleUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;