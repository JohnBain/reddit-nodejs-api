var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var redditAPI = require('./redditfunctions.js')

app.get('/greet', function(request, response) {
  console.log(request.headers)
  var name = request.query.name;
  var result = "Hello " + name;
  response.send(result);
})

//greet?name=john

app.get('/', function(req, res) {
  redditAPI.getHomepage(req.query.sort, function(result) {  //This is where we pass the sorting query
    var finalstring = `<div id="contents">
    <h1>Fake Reddit Homepage</h1>
    <ul class="contents-list">`
    console.log(result)
    result.forEach(function(post) {
      finalstring += `<li class="content-item">
      <h2 class='${post.title}'>
        <p>${post.score} <a href='${post.url}'/>${post.title}</a>
      </h2>
      <p>Created by ${post.user} at ${post.createdAt}</p>`
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
  redditAPI.createUser({
    username: req.body.username,
    password: req.body.password,
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
    res.sendFile('/home/ubuntu/workspace/login.html');
});

app.post('/login', function(req, res){
  redditAPI.checkLogin(req.body.username, req.body.password, 
  function(err, user){
    if (err) {res.status(401).send(err.message);}
    else {
      redditAPI.createSession(user.id, function(err, token){
        if (err) {
          res.status(500).send('Authentication failed. Please try again later.')
        }
        else {
          res.cookie('SESSION', token);
          res.redirect('/login')
        }
      })
    }
  })
});

app.get('/loginsuccessful', function(req, res){
  console.log(req)
  res.send("<h1>Yay</h2>")
});

app.get('/createpost', function(req, res){
  
});

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
