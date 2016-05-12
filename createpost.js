module.exports = function postForm(user, subreddit){
  subreddit = 4
  return `
  <div id="spinner"></div>
    <form action="/createpost" method="POST">
  <div>
    <p>Create a post as <b>${user}</b> in ${subreddit}:</p>
  </div>
  <div>
    <input type="text" class="the-title" name="title" placeholder="Enter a title">
  </div>
  <div>
  <button class="suggest-title" type="button">Suggest title</button>
  </div>
  <div>
    <input type="text" class="the-url" name="url" placeholder="Enter a url">
  </div>
  <div>
    <textarea name="selftext"></textarea>
  </div>
  <button type="submit">Create post!</button>
</form>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
          <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
          <script type="text/javascript" src="../js/title.js"></script>
  </div>`
}

