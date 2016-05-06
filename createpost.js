module.exports = function createPost(user){
  return `
    <form action="/createpost" method="POST">
  <div>
    <p>Create a post as <b>${user}</b>:</p>
  </div>
  <div>
    <input type="text" name="title" placeholder="Enter a title">
  </div>
  <div>
    <input type="text" name="url" placeholder="Enter a url">
  </div>
  <div>
    <textarea name="selftext"></textarea>
  </div>
  <button type="submit">Create post!</button>
</form>
  `
}

