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
    cristalCount int(10) DEFAULT 0,
    chestCount int(10) DEFAULT 0,
    name varchar(255) NOT NULL,
    image varchar(255) NULL,
    surname varchar(255) NUll,
    dateOfBirth date NOT NULL,
    FOREIGN KEY (userId) REFERENCES jungleUser(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    type int(10) NOT NULL,
    order int(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS question(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    taskId int(10) NOT NULL,
    type int(10) NOT NULL,
    name varchar(255) NOT NULL,
    order int(10) NOT NULL,
    image varchar(255) NULL,
    sound varchar(255) NULL,
    cristalCount int(10) NOT NULL DEFAULT 1,
    FOREIGN KEY (taskId) REFERENCES task(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS variant(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    questionId int(10) NOT NULL,
    name varchar(255) NOT NULL,
    FOREIGN KEY (questionId) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    questionId int(10) NOT NULL,
    name varchar(255) NOT NULL,
    image varchar(255) NULL,
    isCorrect bit DEFAULT 0,
    correctVariantId int(10) NULL,
    FOREIGN KEY (questionId) REFERENCES question(id) ON DELETE CASCADE,
    FOREIGN KEY (correctVariantId) REFERENCES variant(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS childAnswer(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    childId int(10) NOT NULL,
    answerId int(10) NOT NULL,
    variantId int(10) NULL,
    tryCount int(1) DEFAULT 1,
    lastUpdateDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (childId) REFERENCES child(id) ON DELETE CASCADE,
    FOREIGN KEY (answerId) REFERENCES answer(id) ON DELETE CASCADE,
    FOREIGN KEY (variantId) REFERENCES variant(id) ON DELETE CASCADE
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

ALTER TABLE
    `messages`
ADD
    FOREIGN KEY (`userId`) REFERENCES `jungleUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DROP TRIGGER IF EXISTS upd_child_answer;

-- DELIMITER $$
--     CREATE TRIGGER upd_child_answer BEFORE UPDATE ON `childAnswer`
--     FOR EACH ROW BEGIN
--       IF (OLD.tryCount = 3) THEN
--             SET NEW.tryCount = 1;
--       ELSE
--             SET NEW.tryCount = OLD.tryCount + 1;
--       END IF;
--     END$$
-- DELIMITER ;
-- SELECT
--     ca.tryCount,
--     q.cristalCount
-- FROM
--     childAnswer ca
--     JOIN answer a ON ca.answerId = a.id
--     JOIN question q ON a.questionId = q.id
-- WHERE
--     ca.childId = 1
--     AND (
--         a.isCorrect
--         OR (
--             a.correctVariantId IS NOT NULL
--             AND a.correctVariantId = ca.variantId
--         )
--     )
--     AND ca.lastUpdateDate >= CURDATE()