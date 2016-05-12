$(document).ready(function() {

    $( "#one" ).slideUp( 300 ).delay( 800 ).fadeIn( 400 );
    $( "#two" ).slideUp( 300 ).delay( 800 ).fadeIn( 400 );
    $( "#three" ).slideUp( 300 ).delay( 800 ).fadeIn( 400 );
    $('#check').hide().delay(1500).fadeIn(1000);

    $('.vote').submit(function(event) {
        event.preventDefault();
        var item = {
            vote: this.vote.value,
            postId: this.postId.value,
        }
        $.post('/vote', item, function(res) {
            console.log(res.score, 'here is res') //It has to receive an object! You were sending an integer before.
            $('#' + item.postId).text(res.score)
        });

    })

    $('.uparrow').click(function() {
        $(this).attr("src", "../images/uparrow-activated.png");
        $(this).effect('bounce', {
            times: 3
        }, 500)

    })

    $('.downarrow').click(function() {
        $(this).attr("src", "../images/downarrow-activated.png");
        $(this).effect('bounce', {
            times: 3
        }, 500)

    })



});

//When we do a post request, it feeds it a vote in the format { vote: '1', postId: '37'}
//then plugs in the logged in user's ID.

//redditAPI.votePost(req.body.vote, req.body.postId, req.loggedInUser.id, function(post) {
//    res.redirect('/')
//  })