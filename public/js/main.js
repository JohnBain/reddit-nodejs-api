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
        $.post('/vote', item, function(){
            $.get('/vote', function(res){
                console.log(res, "THIS SHOULD BE THE SHIT")
            console.log("We're in the get method")
        })
        });
        
        
       
    })
});

//When we do a post request, it feeds it a vote in the format { vote: '1', postId: '37'}
//then plugs in the logged in user's ID.

//redditAPI.votePost(req.body.vote, req.body.postId, req.loggedInUser.id, function(post) {
//    res.redirect('/')
//  })