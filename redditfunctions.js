var mysql = require('mysql');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
var HASH_ROUNDS = 10;







// create a connection to our Cloud9 server
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'jbain1', // CHANGE THIS :)
  password: '',
  database: 'reddit'
});

var getHomepage = function(sort, callback) {
  var askSQL = "";
  sort === "top" ? askSQL = "score DESC" : null;
  sort === "hot" ? askSQL = "hotScore DESC, posts.createdAt DESC" : null;
  sort === "new" ? askSQL = "posts.createdAt DESC" : null;
  sort === "controversial" ? askSQL = "contScore DESC, posts.createdAt DESC" : askSQL = "posts.createdAt DESC";
  //^the last else condition here makes it so if no query or a different query is passed we just sort by new
  conn.query(`
        SELECT *, posts.selftext, COALESCE(sum(votes.vote), 0) AS score, posts.id AS postID, users.username,
        score/TIMEDIFF(NOW(), posts.createdAt) AS hotScore
        FROM posts 
        LEFT JOIN votes ON posts.id = votes.postId
        JOIN users ON posts.userId = users.id
        JOIN subreddits ON posts.subredditId = subreddits.id
        WHERE subredditId = 3
        GROUP BY posts.id
        ORDER BY ${askSQL}
        `,
    function(err, results) { 
      if (err) {
        callback(err);
      }
      else {
        var x = results.map(function(post) {
          return {
            id: post.postID,
            score: post.score,
            title: post.title,
            url: post.url,
            selftext: post.selftext,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            userId: post.userId,
            user: post.username,
          };
        });
        callback(x);
      }
    }
  )
}

var createPost = function(post, callback) {
  conn.query(
    'INSERT INTO `posts` (`userId`, `title`, `url`, `subredditId`, `selftext`, `createdAt`) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.selftext, post.subredditId, null],
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
          'SELECT `id`,`title`,`url`,`userId`, `selftext`, `createdAt`, `subredditId`, `updatedAt` FROM `posts` WHERE `id` = ?', [result.insertId],
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
}


var getAllPosts = function(callback) {
  conn.query(`
        SELECT *, posts.id AS postID, users.username FROM posts JOIN users ON posts.userId = users.id
        ORDER BY posts.createdAt DESC
        `,
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
            user: post.username,
          };
        });
        callback(x);
      }
    }
  )
}

var createPost = function(post, callback) {
  conn.query(
    'INSERT INTO `posts` (`userId`, `title`, `url`, `subredditId`, `selftext`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.subredditId, post.selftext, null],
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
          'SELECT `id`,`title`,`url`,`userId`, `createdAt`, `subredditId`, `selftext`, `updatedAt` FROM `posts` WHERE `id` = ?', [result.insertId],
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
};

var deletePost = function(postname, callback){
  conn.query(`DELETE FROM posts WHERE title = '${postname}' LIMIT 1`), function(err, result){
    if (err){
      callback(err)
    }
    else{
      callback(result);
    }
  }
}

var createUser = function(user, callback) {

  bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
    if (err) {
      callback(err);
    }
    else {
      conn.query(
        'INSERT INTO `users` (`username`,`password`, `createdAt`) VALUES (?, ?, ?)', [user.username, hashedPassword, null],
        function(err, result) {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              callback(new Error('A user with this username already exists'));
            }
            else {
              callback(err);
            }
          }
          else {
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
                  callback(null, result);
                }
              }
            );
          }
        }
      );
    }
  });
};


// createPost({
//   title: 'YET ANOTHER CAT POST!!!!!!!',
//   url: 'https://www.placekitten.com',
//   userId: 1,
//   subredditId: 3
// }, function(err, post) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(post);
//   }
// });

var checkLogin = function(user, pass, callback) {
  conn.query('SELECT * FROM users WHERE username = ?', [user], function(err, result) {
    // check for errors, then...
    if (result.length === 0) {
      callback(new Error('username or password incorrect')); // in this case the user does not exists
    }
    else {
      var user = result[0];
      var actualHashedPassword = user.password;
      bcrypt.compare(pass, actualHashedPassword, function(err, result) {
        if (result === true) { // let's be extra safe here
          callback(null, user);
        }
        else {
          callback(new Error('username or password incorrect')); // in this case the password is wrong, but we reply with the same error
        }
      });
    }
  });
};

var createSessionToken = function() {
  return secureRandom.randomArray(100).map(code => code.toString(36)).join('');
}

var createSession = function (userId, callback) {
  var token = createSessionToken();
  conn.query('INSERT INTO sessions SET userId = ?, token = ?', [userId, token], function(err, result) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, token); 
    }
  });
}

var getUserFromSession = function (sessionToken, callback){
  conn.query(`select distinct users.* from sessions JOIN users ON users.id = sessions.userId where token = ?`, [sessionToken], function(err,result){
    callback(null, result[0])
  })
}


module.exports = {
  getAllPosts, createPost, getHomepage, createUser, checkLogin, createSession, getUserFromSession, deletePost
};
