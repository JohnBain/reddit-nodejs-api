var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var redditAPI = require('./redditfunctions.js')
var createPost = require('./createpost.js')

app.use(cookieParser()); // this middleware will add a `cookies` property to the request, an object of key:value pairs for all the cookies we set
app.use(bodyParser());
app.use(express.static('public'))

function createHead(content) {
  return `
    <head>
      <link rel="stylesheet" type="text/css" href="../css/main.css">
    </head>
    <body>
      ${content}
    </body>
  `
}

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

// app.get('/controlpanel', function(request, response) {
//   if (!request.loggedInUser || request.loggedInUser.isAdmin === 0) {
//     response.status(401).send('Administrators only!');
//   }
//   if (request.loggedInUser.isAdmin === 1) {
//     response.sendFile('/home/ubuntu/workspace/controlpanel.html')
//   }
// });


function renderLayout(content) {
  console.log(content)
  return `<!doctype><html><head><title>" + "Reddit Homepage" + "</title><link rel="stylesheet" type="text/css" href="../css/main.css"></head>

            <body class="HolyGrail">
            <section class="HolyGrail-body">
            <nav class="HolyGrail-nav">
            <ul>
            <li>/r/FakeSubreddit</li>
            <li>/r/ConspiracyTheories</li>
            <li>/r/TrudeauIsMyBro</li></ul>
            </nav>

            ${content} 
  `
}


app.get('/', function(req, res) {
  redditAPI.getHomepage(req.query.sort, function(result) { //This is where we pass the sorting query
    var finalstring = `
    <section class="bandC">
    <main class="HolyGrail-content">
     
    <p>You are logged in as ${req.loggedInUser.username}</p>`
    
    result.forEach(function(post) { ///REUSEABLE CONTENT
      finalstring += `
      <li class="content-item">
        <section class="godzilla">
            <div id="votes">
              <form action="/vote" method="post">
              <input type="hidden" name="vote" value="1">
              <input type="hidden" name="postId" value="${post.id}">
              <button type="submit"><img src="../images/uparrow.png"></button>
              </form>
              <form action="/vote" method="post">
              <input type="hidden" name="vote" value="0">
              <input type="hidden" name="postId" value="${post.id}">
              <button type="submit"><img src="../images/cancel.png"></button>
              </form>
              <form action="/vote" method="post">
               <input type="hidden" name="vote" value="-1">
              <input type="hidden" name="postId" value="${post.id}">
               <button type="submit"><img src="../images/downarrow.png"></button>
              </form>
            </div>
      
    <div id="post">
      <h2 class='${post.title}'>
        <p>${post.score} <a href='${post.url}'/>${post.title}</a>
      </h2>
      <p>Created by ${post.user} at ${post.createdAt}</p>
    </div>
    `
    })

    finalstring += `</li> </ul></section></main>    <aside class="HolyGrail-ads">
            <ul>
            <li><a href="/signup">signup</la</li>
            <li><a href="/login">login</la</li>
            <li><a href="/createpost">create a post</la</li>
            <li><a href="/login">login</la</li>
            </ul>
            </aside></section>
      </section>
    `
    
    res.send(renderLayout(finalstring))

  })
});

app.post('/vote', function(req, res) {
  console.log(req.body, req.loggedInUser.id);


  redditAPI.votePost(req.body.vote, req.body.postId, req.loggedInUser.id, function(post) {
    res.redirect('/')
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

app.get('/controlpanel', function(request, response) {
  if (!request.loggedInUser || request.loggedInUser.isAdmin === 0) {
    response.status(401).send('Administrators only!');
  }
  if (request.loggedInUser.isAdmin === 1) {
    response.sendFile('/home/ubuntu/workspace/controlpanel.html')
  }
});

app.post('/controlpanel', function(request, response) {
  redditAPI.deletePost(request.body.title, function(post) {
    response.redirect('/')
  })
});

app.get('/createpost', function(request, response) {
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to create content!');
  }
  response.send(createPost(request.loggedInUser.username))
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
        userId: request.loggedInUser.id,
        title: request.body.title,
        url: request.body.url,
        subredditId: 3,
        selftext: request.body.selftext //We're limiting ourselves to the homepage for now
      }, function(err, post) {
        response.redirect('/')
      })
    }
  })
  //  'INSERT INTO `posts` (`userId`, `title`, `url`, `subredditId`, `selftext`, `createdAt`) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.subredditId, post.selftext, null],


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
