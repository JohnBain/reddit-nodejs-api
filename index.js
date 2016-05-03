// function sortByKey(array, key) {
//     return array.sort(function(a, b) {
//         var x = a[key]; var y = b[key];
//         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
//     });
// }


var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var redditAPI = require('./redditfunctions.js')

app.get('/', function(req, res) {
  redditAPI.getHomepage(function(result) {
    var finalstring = `<div id="contents">
    <h1>Fake Reddit Homepage</h1>
    <ul class="contents-list">`
    //result = sortByKey(result, 'id'); //Sorting in ascending order by key
    console.log(result)
    result.forEach(function(post) {
      finalstring += `<li class="content-item">
      <h2 class='${post.title}'>
        <p>${post.score} <a href='${post.url}'/>${post.title}</a>
      </h2>
      <p>Created by ${post.user}</p>`
    })
   
    finalstring += "</li> </ul> </div>"
    res.send(finalstring)
  })
});

app.use(bodyParser());

app.get('/signup', function(req, res) {
  res.sendFile('/home/ubuntu/workspace/signup.html')
})

app.post('/signup', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  var signupUsername = req.body.username;
  var signupPassword = req.body.password;
  redditAPI.createUser({
    username: signupUsername,
    password: signupPassword,
  }, function(err, user) {
    if (err) {
      console.log(err)
      res.send("Error. User not created.");
    }
    else {
      res.redirect('/')
    }
  });
});


app.get('/login', function(req, res){
  
})

app.get('/createpost', function(req, res){
  
})

// app.get('/createContent', function(req, res) {
//   console.log(req)
//   res.sendFile('/home/ubuntu/workspace/form.html')
// })

// app.post('/createContent', function(req, res) {
//   var postUrl = req.body.url;
//   var postTitle = req.body.title;
//   redditAPI.createPost({
//     title: postTitle,
//     url: postUrl,
//     userId: 1,
//     subredditId: 3
//   }, function(err, post) {
//     if (err) {
//       res.send("Error. Post not created.");
//     }
//     else {
//       res.redirect('/posts')
//     }
//   });
// });


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
