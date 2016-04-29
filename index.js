// load the mysql library
var mysql = require('mysql');

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'jbain1', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);

// It's request time!
/*
redditAPI.createUser({
  username: 'anotheruser',
  password: 'yes'
}, function(err, user) {
  if (err) {
    console.log(err);
  }
  else {
    redditAPI.createPost({
      title: 'another post!',
      url: 'https://www.decodemtl.com',
      userId: user.id
    }, function(err, post) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(post);
      }
    });
  }
});
*/

/*redditAPI.createPost({
      title: 'Cat bonanza!',
      url: 'https://www.placekitten.com',
      userId: 7,
      subredditId: 3
    }, function(err, post) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(post);
      }
    });
*/


/*redditAPI.getAllPosts(function(err, result){
  err ? console.log(err) : console.log(result)
});*/

/*
redditAPI.getSinglePost(1, function(err,result){
  err ? console.log(err) : console.log(result);
});
*/

/*redditAPI.createSubreddit({
      name: 'Cats',
      description: 'Cats!',
    }, function(err, post) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(post);
      }
    });*/
    
/*redditAPI.getAllSubreddits(function(err, result){
  err ? console.log(err) : console.log(result)
});*/


/*redditAPI.createComment({
      text: 'Another top level comment',
      userId: 1,
      postId: 6,
    }, function(err, post) {            //I tried this both with and without parentId. Checks out.
      if (err) {
        console.log(err);
      }
      else {
        console.log(post);
      }
    });
    */
    
redditAPI.getCommentsforPost(6, function(err,result){
  err ? console.log(err) : require('util').log(result);
});




