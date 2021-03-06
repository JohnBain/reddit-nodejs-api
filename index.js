var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var redditAPI = require('./redditfunctions.js');
var createPost = require('./createpost.js');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');


app.use(cookieParser()); // this middleware will add a `cookies` property to the request, an object of key:value pairs for all the cookies we set
app.use(bodyParser());
app.use(express.static('public'))

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
  return `<!doctype><html><head><title>" + "Reddit Homepage" + "</title><link rel="stylesheet" type="text/css" href="../css/main.css">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
          <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
          <script type="text/javascript" src="../js/main.js"></script>
<div>
<header>
    <h1>
    <span id="fulltitle"><span id='one'>Fake</span> <span id='two'>Reddit</span> <span id='three'>Homepage</span><span id='check'>✔</span></span>
    </h1>
</header>         
<div>
<nav>
    <ul>
        <li><a href="/?subreddit=1">/r/AdviceAnimals</a></li>
        <li><a href="/?subreddit=3">/r/Cats</a></li>
        <li><a href="/?subreddit=4">/r/Homepage</a></li>
        <li><a href="/?subreddit=7">/r/Sadfrogs</a></li>
        <li><a href="/?subreddit=8">/r/Me_IRL</a></li>
    </ul>
</nav>
<main>
  ${content}
</main>
</div>
<div class="aside">
  <aside class="sideContainer">
    <ul>
      <li><a href="/signup">signup</a></li>
      <li><a href="/login">login</a></li>
      <li><a href="/createpost">create a post</a></li>
      <li><a href="/controlpanel">admin console</a></li>
    </ul>
</aside> 
</div>
</div>
          </html>`
}


app.get('/', function(req, res) {

  var options = {
    subreddit: req.query.subreddit,
    sort: req.query.sort
  };

  redditAPI.getHomepage(options, function(result) { //This is where we pass the sorting query
    var finalstring = `
    <h3>Welcome to /r/${result[0].subreddit}</h3>
    You are logged in as ${req.loggedInUser.username}<br>
    <ul class="tabrow"><li><a href="/?sort=hot">hot</a></li> <li><a href="/?sort=top">top</a></li> <li><a href="/?sort=new">new</a></li>
    <li><a href="/?sort=controversial">controversial</a></li></ul>`

    result.forEach(function(post) { ///REUSEABLE CONTENT

      finalstring += `<li class="content-item">
        <div class="godzilla">
        <div id="votes">
          <form class="vote" action="/vote" method="post">
          <input type="hidden" name="vote" value="1">
          <input type="hidden" name="postId" value="${post.id}">
          <button type="submit"><img class="uparrow" src="../images/uparrow.png"></button>
          </form>
          <form class="vote" action="/vote" method="post">
          <input type="hidden" name="vote" value="0">
          <input type="hidden" name="postId" value="${post.id}">
          <button type="submit"><img src="../images/cancel.png"></button>
          </form>
          <form class="vote"  action="/vote" method="post">
           <input type="hidden" name="vote" value="-1">
          <input type="hidden" name="postId" value="${post.id}">
           <button type="submit"><img class = "downarrow" src="../images/downarrow.png"></button>
        </form>
        </div>
      
  <div id="post">
      <h2 class='${post.title}'>
        <p><span id="${post.id}">${post.score}</span> <a href='${post.url}'/>${post.title}</a>
      </h2>
      <p>Created by ${post.user} at ${post.createdAt}</p>
    </div>
    `
    })

    finalstring += `</ul> </li> </ul> </div> 
    `

    res.send(renderLayout(finalstring))

  })
});

app.post('/vote', function(req, res) {
  redditAPI.votePost(req.body.vote, req.body.postId, req.loggedInUser.id, function(err, post) {
    if (err){console.log("There was an error", err)}
    else{
    console.log(post[0].score, 'here is res score score soaosdasdasd')
    res.send({score: post[0].score})  //It doesn't like receiving integers as input, so send an object.
    }
  })
});

app.get('/vote', function(req, res) {
})


app.get('/signup', function(req, res) {
  renderLayout(res.sendFile('/home/ubuntu/workspace/signup.html'))
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

app.get('/createpost', function(request, response) {    //headers.referer is URL of referer
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to create content!');
  }
  response.send(renderLayout(createPost(request.loggedInUser.username, request.query.subreddit))) //broken
})

app.post('/createpost', function(request, response) {
    // before creating content, check if the user is logged in
    if (!request.loggedInUser) {
      // HTTP status code 401 means Unauthorized
      response.status(401).send('You must be logged in to create content!');
    }
    else {
      console.log(request.body) // working
      // here we have a logged in user, let's create the post with the user!
      redditAPI.createPost({
        userId: request.loggedInUser.id,
        title: request.body.title,
        url: request.body.url,
        subredditId: 4, //No idea how to change this to reflect subreddit Id
        selftext: request.body.selftext //We're limiting ourselves to the homepage for now
      }, function(err, post) {
        response.redirect('/')
      })
    }
  })
  //  'INSERT INTO `posts` (`userId`, `title`, `url`, `subredditId`, `selftext`, `createdAt`) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.subredditId, post.selftext, null],

app.get('/getTitle', function(req, res) {
    var url = req.query.url;
    
    request(url, function(err, response) {
        if (err) {
            console.log("Reached the error", err)
            res.send("");
        }
        else {
          var $ = cheerio.load(response.body);
          var title = $('title').text()
          console.log($('title').text())
           console.log("We have reached the thing")
                res.send(title); 
        }
        
    });
});

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});