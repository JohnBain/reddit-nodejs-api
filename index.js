var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var redditAPI = require('./redditfunctions.js')


app.use(cookieParser()); // this middleware will add a `cookies` property to the request, an object of key:value pairs for all the cookies we set
app.use(bodyParser());

function checkLoginToken(request, response, next) {
  // check if there's a SESSION cookie...
  if (request.cookies.SESSION) {
    redditAPI.getUserFromSession(request.cookies.SESSION, function(err, user) {
      // if we get back a user object, set it on the request. From now on, this request looks like it was made by this user as far as the rest of the code 
      //is concerned
      if (user) {
        request.loggedInUser = user;
      }
      next();
    });
  }
  else {
    // if no SESSION cookie, move forward
    next();
  }
}

app.use(checkLoginToken);

app.get('/greet', function(request, response) {
  var name = request.query.name;
  var result = "Hello " + name;
  response.send(result);
})

//greet?name=john

app.get('/', function(req, res) {
  redditAPI.getHomepage(req.query.sort, function(result) { //This is where we pass the sorting query
    var finalstring = `<div id="contents">
    <h1>Fake Reddit Homepage</h1>
    <ul class="contents-list">`
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


app.get('/login', function(req, res) {
  res.sendFile('/home/ubuntu/workspace/login.html');
});

app.post('/login', function(req, res) {
  redditAPI.checkLogin(req.body.username, req.body.password,
    function(err, user) {
      if (err) {
        res.status(401).send(err.message);
      }
      else {
        redditAPI.createSession(user.id, function(err, token) {
          if (err) {
            res.status(500).send('Authentication failed. Please try again later.')
          }
          else {
            res.cookie('SESSION', token);
            res.redirect('/')
          }
        })
      }
    })
});

app.get('/createpost', function(request, response) {
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to create content!');
  }
  response.sendFile('/home/ubuntu/workspace/createpost.html')
})

app.post('/createpost', function(request, response) {
  // before creating content, check if the user is logged in
  if (!request.loggedInUser) {
    // HTTP status code 401 means Unauthorized
    response.status(401).send('You must be logged in to create content!');
  }
  else {
    // here we have a logged in user, let's create the post with the user!
    redditAPI.createPost({
      title: request.body.title,
      url: request.body.url,
      userId: request.loggedInUser.id,
      subredditId: 3          //We're limiting ourselves to the homepage for now
    }, function(err, post) {
      response.redirect('/')
    })
  }
})


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
