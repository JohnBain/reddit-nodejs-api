
CREATE TABLE `comments`
(
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(10000) NOT NULL,
  `userId` INT(11),
  `parentId` int(11) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


select text as comtext, parentId as replied_to from comments comtext join comments on parentId = comtext.id;

SELECT comments.parentId, comments.id, comments.text, comments.userId, comments.createdAt, comments.updatedAt, p1.parentId, p1.id, p1.text, p1.userId, p1.createdAt, p1.updatedAt, p2.parentId, p2.text, p2.userId, p2.createdAt, p2.updatedAt FROM comments 
LEFT JOIN comments AS p1 ON comments.id = p1.parentId 
LEFT JOIN comments AS p2 ON p1.id = p2.parentId ORDER BY comments.createdAt, p1.createdAt, p2.createdAt;



+-----------+----------------+------+-----+---------------------+-----------------------------+
| Field     | Type           | Null | Key | Default             | Extra                       |
+-----------+----------------+------+-----+---------------------+-----------------------------+
| id        | int(11)        | NO   | PRI | NULL                | auto_increment              |
| text      | varchar(10000) | NO   |     | NULL                |                             |
| userId    | int(11)        | YES  | MUL | NULL                |                             |
| parentId  | int(11)        | YES  | MUL | NULL                |                             |
| createdAt | timestamp      | NO   |     | 0000-00-00 00:00:00 |                             |
| updatedAt | timestamp      | NO   |     | CURRENT_TIMESTAMP   | on update CURRENT_TIMESTAMP |
| postId    | int(11)        | YES  | MUL | NULL                |                             |
+-----------+----------------+------+-----+---------------------+-----------------------------+

SELECT p.id AS parentId, p.text AS parentText, p.createdAt as parentCreatedAt, p.updatedAt AS parentUpdatedAt,
           p.parentId AS parentParentId, p.userId AS parentUserId, p.username AS parentUserName, p.postId,
           c1.id AS c1Id, c1.text AS c1Text, c1.createdAt as c1CreatedAt, c1.updatedAt AS c1UpdatedAt,
           c1.parentId AS c1ParentId, c1.userId AS c1UserId, c1.username AS c1UserName,
           c2.id AS c2Id, c2.text AS c2Text, c2.createdAt as c2CreatedAt, c2.updatedAt AS c2UpdatedAt,
           c2.parentId AS c2ParentId, c2.userId AS c2UserId, c2.userName AS c2UserName
           FROM 
           (SELECT u.username, c.id, c.text, c.createdAt, c.updatedAt,
           c.parentId, c.userId, c.postId FROM comments c LEFT JOIN users u ON u.id = c.userId) AS p
           LEFT JOIN 
           (SELECT u.username, c.id, c.text, c.createdAt, c.updatedAt,
           c.parentId, c.userId FROM comments c LEFT JOIN users u ON u.id = c.userId) AS c1
           ON (c1.parentId = p.id) 
           LEFT JOIN 
           (SELECT u.username, c.id, c.text, c.createdAt, c.updatedAt,
           c.parentId, c.userId FROM comments c LEFT JOIN users u ON u.id = c.userId) AS c2
           ON (c2.parentId = c1.id) WHERE p.postId = ? AND p.parentId IS NULL ORDER BY p.createdAt, c1.createdAt, c2.createdAt`

1 new message since 2:21 PM
Mark as read