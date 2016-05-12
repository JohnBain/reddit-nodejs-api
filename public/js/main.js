$(document).ready(function() {
    $('.uparrow').click(function() {
        $(this).effect('bounce', {times:3}, 500)
    });
    
    $('.vote').submit(function(event) {
        event.preventDefault();
        var item = {vote: this.vote.value,
         postId: this.postId.value,
        }
        console.log(item)
        $(this).append(this.vote.value)        //use nth-child and parseInt to solve this, tomorrow!
        
       
    })
});

//When we do a post request, it feeds it a vote in the format { vote: '1', postId: '37'}
//then plugs in the logged in user's ID.

//redditAPI.votePost(req.body.vote, req.body.postId, req.loggedInUser.id, function(post) {
//    res.redirect('/')
//  })