var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;

module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user, callback) {

      // first we have to hash the password...
      bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
        if (err) {
          callback(err);
        }
        else {
          conn.query(
            'INSERT INTO `users` (`username`,`password`, `createdAt`) VALUES (?, ?, ?)', [user.username, hashedPassword, null],
            function(err, result) {
              if (err) {
                /*
                There can be many reasons why a MySQL query could fail. While many of
                them are unknown, there's a particular error about unique usernames
                which we can be more explicit about!
                */
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                /*
                Here we are INSERTing data, so the only useful thing we get back
                is the ID of the newly inserted row. Let's use it to find the user
                and return it
                */
                conn.query(
                  'SELECT `id`, `username`, `createdAt`, `updatedAt` FROM `users` WHERE `id` = ?', [result.insertId],
                  function(err, result) {
                    if (err) {
                      callback(err);
                    }
                    else {
                      /*
                      Finally! Here's what we did so far:
                      1. Hash the user's password
                      2. Insert the user in the DB
                      3a. If the insert fails, report the error to the caller
                      3b. If the insert succeeds, re-fetch the user from the DB
                      4. If the re-fetch succeeds, return the object to the caller
                      */
                      callback(null, result[0]);
                    }
                  }
                );
              }
            }
          );
        }
      });
    },
    createPost: function(post, callback) {
      conn.query(
        'INSERT INTO `posts` (`userId`, `title`, `url`, `subredditId`, `createdAt`) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.subredditId, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT `id`,`title`,`url`,`userId`, `createdAt`, `subredditId`, `updatedAt` FROM `posts` WHERE `id` = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    createComment: function(comment, callback) {
      if (comment.hasOwnProperty("parentId")) {
        var sqlstring = 'INSERT INTO `comments` (`text`, `userId`, `postId`, `parentId`, `createdAt`) VALUES (?, ?, ?, ?, ?)';
        var variables = [comment.text, comment.userId, comment.postId, comment.parentId, null];
      }
      else {
        var sqlstring = 'INSERT INTO `comments` (`text`, `userId`, `postId`, `createdAt`) VALUES (?, ?, ?, ?)';
        var variables = [comment.text, comment.userId, comment.postId, null];
      };

      conn.query(
        sqlstring, variables,
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT * FROM `comments` WHERE `id` = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    createSubreddit: function(subreddit, callback) { //takes an object as first arg, btw. Just like createPost.
      conn.query(
        'INSERT INTO `subreddits` (`name`, `description`, `createdAt`) VALUES (?, ?, ?)', [subreddit.name, subreddit.description, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Subreddit created successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT * FROM `subreddits` WHERE `id` = ?', [result.insertId], //WHY DOES THIS WORK?
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    getAllPosts: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT *, users.createdAt AS userCreatedat, users.updatedAt AS userUpdatedat, posts.id AS postID, subreddits.id AS subredditsId, subreddits.createdAt AS subredditcreatedAt, subreddits.updatedAt AS subredditupdatedAt FROM posts JOIN users ON posts.userId = users.id JOIN subreddits on posts.subredditId = subreddits.id
        ORDER BY posts.createdAt DESC
        LIMIT ? OFFSET ?
        `, [limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            var x = results.map(function(post) {
              return {
                id: post.postID,
                title: post.title,
                url: post.url,
                selftext: post.selftext,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                userId: post.userId,
                user: {
                  id: post.userId,
                  user: post.username,
                  createdAt: post.userCreatedat,
                  updatedAt: post.userUpdatedat
                },
                subreddit: {
                  id: post.subredditId,
                  name: post.name,
                  description: post.description,
                  createdAt: post.subredditcreatedAt,
                  updatedAt: post.subredditupdatedAt
                }
              };
            });
            callback(null, x);


          }
        }
      );
    },

    getAllSubreddits: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT * FROM subreddits  
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
        `, [limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        }
      );
    },

    getAllPostsForUser: function(userId, options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT *, users.createdAt AS userCreatedat, users.updatedAt AS userUpdatedat, posts.id AS postID FROM posts JOIN users ON posts.userId = users.id WHERE userId = ? 
        ORDER BY posts.createdAt DESC
        LIMIT ? OFFSET ?
        `, [userId, limit, offset],
        function(err, results) { //We should abstract this all to a function
          if (err) {
            callback(err);
          }
          else {
            var x = results.map(function(post) {
              return {
                id: post.postID,
                title: post.title,
                url: post.url,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                userId: post.userId,
                user: {
                  id: post.userId,
                  user: post.username,
                  createdAt: post.userCreatedat,
                  updatedAt: post.userUpdatedat
                }
              };
            });
            callback(null, x);
          }
        }
      );
    },

    getSinglePost: function(id, callback) {

      conn.query(`
        SELECT *, users.createdAt AS userCreatedat, users.updatedAt AS userUpdatedat, posts.id AS postID FROM posts JOIN users ON posts.userId = users.id
        WHERE posts.id = ?
        LIMIT 1
        `, [id],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            var x = results.map(function(post) {
              return {
                id: post.postID,
                title: post.title,
                url: post.url,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                userId: post.userId,
                user: {
                  id: post.userId,
                  user: post.username,
                  createdAt: post.userCreatedat,
                  updatedAt: post.userUpdatedat
                }
              }
            });
            callback(null, x[0]);
          }
        }
      );
    },
    getCommentsforPost: function(postId, callback) {

        conn.query(`
        SELECT comments.parentId, comments.id, comments.text, comments.userId, comments.createdAt, comments.updatedAt, p1.parentId AS p1parentId, p1.id AS p11Id, p1.text AS p1text, p1.userId AS p1userId, p1.createdAt AS p1createdAt, p1.updatedAt AS p1updatedAt, p2.parentId AS p2parentId, p2.text AS p2text, p2.Id AS p2Id, p2.userId AS p2userId, p2.createdAt AS p2createdAt, p2.updatedAt AS p2updatedAt FROM comments 
        LEFT JOIN comments AS p1 ON comments.id = p1.parentId 
        LEFT JOIN comments AS p2 ON p1.id = p2.parentId WHERE comments.parentId IS NULL ORDER BY comments.createdAt, p1.createdAt, p2.createdAt ;
        `, [postId],
          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              var bin = [];
              var index = [];
             
              results.forEach(function(row) {
                var top = {
                  id: row.id,
                  parentId: row.parentId,
                  text: row.text,
                  userId: row.userId,
                  createdAt: row.createdAt,
                  updatedAt: row.updatedAt,
                  replies: []
                }
                if (row.p1Id != "null") {
                  var mid = {
                    id: row.p11Id,
                    parentId: row.p1parentId,
                    text: row.p1text,
                    userId: row.p1userId,
                    createdAt: row.p1createdAt,
                    updatedAt: row.p1updatedAt,
                    replies: []
                  }
                  if (row.p2Id != "null") {
                   
                     var bot = {
                      id: row.p2Id,
                      parentId: row.p2parentId,
                      text: row.p2text,
                      userId: row.p2userId,
                      createdAt: row.p2createdAt,
                      updatedAt: row.p2updatedAt,
                      replies: []
                    }
                 console.log(row)
                  }
                }
              if (bot){
                mid['replies'].push(bot)
                var bot;
              }
              if (mid){
                top['replies'].push(mid)
                var mid;
              };
              if (!index[top.id]) {
                index[top.id] = top;
                bin.push(top);
              }




              });
              callback(null, bin);
            }
          }
        );
      } //,
  }

}
