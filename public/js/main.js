$(document).ready(function() {
    $('.uparrow').click(function() {
        $(this).effect('bounce', {times:3}, 500)
    });
    
    $('.vote').submit(function(event) {
        event.preventDefault();
        var item = {vote: this.vote.value,
         postId: this.postId.value,
        }
        $.post('/vote', item, function(res)
        {
            console.log(res.score, 'here is res')   //It has to receive an object! You were sending an integer before.
            $('#' + item.postId).text(res.score)
        });
        
        
       
    })
});

//When we do a post request, it feeds it a vote in the format { vote: '1', postId: '37'}
//then plugs in the logged in user's ID.

//redditAPI.votePost(req.body.vote, req.body.postId, req.loggedInUser.id, function(post) {
//    res.redirect('/')
//  })