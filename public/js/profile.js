var socket = io();


function getName(){
    var profileName = location.search.substring(1).split('&');
    return profileName[2];
}


function getUser(){
    var profileName = location.search.substring(1).split('&');
    return profileName[1];
}


function getFollowingBool(){
    if(document.getElementById("following").innerHTML = "Follow"){
        return false;
    } else {
        return true;
    }
}

socket.emit("check-following", getUser(), getName());
/*
function followUnfollow(){
    // Follow or unfollow profile and change html
    socket.emit("follow-unfollow", (getFollowingBool(), getUser(), getName()));
}
*/

socket.on("receive-follow-unfollow", (bool) => {
    if(bool == true){
        document.getElementById("following").innerHTML = "Following";
    } else {
        document.getElementById("following").innerHTML = "Follow";
    }
});






var check = false;
function followUnfollow(){
	var array = [ getUser(), getName()];
	console.log(array[0] + " | " + array[1]);
    	socket.emit("follow-unfollow", (array));
	check = true;
}
document.getElementById("username").innerHTML = "@"+getName();
var postNumber = 0;
$( function() {
    // Initialize socket.io
    var socket = io();


    // Simply retrieves bio from profile at the end of the URL.
    socket.emit("get-bio", getName());
    socket.on("receive-bio", (bio) => {
        document.getElementById("BIO").innerHTML = bio;
    });

    // loads posts made by a specific profile at the end of the URL
    socket.emit("load-profile-posts", getName());
    socket.on("display-profile-posts", (result) => {
        for(var i = 0; i < result.length; i++){
            $('.tweets').append(renderThread(result[i]));
        }
    });

    // Checks to see if user is following profile to change html text if necessary.
    socket.on("following-boolean", (bool) => {
        if(bool == true){
            document.getElementById("following").innerHTML = "Following";
        }
    });


    // Check to see if scroll bar has reached bottom. Trigger function to load posts.
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            alert("Bottom");
        }
    });

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            postNumber += 4;
            socket.emit("load-posts");postNumber
        }
     });




    $('.tweets').on('click', '.thread > .tweet', function(){
        var post_ID = $(this)[0].id;
        console.log(post_ID);
        socket.emit("get-comments", (post_ID));
        socket.on("display-comments", (result) => {
            //$(this).parent().find('.thread').find('.replies').append(renderTweet(result));

            if($(this).parent().find('.replies')[0].id == '0'){
                for(var i = 0; i < result.length; i++){
                        $(this).parent().find('.replies').append(renderTweet(result[i]));
                        $(this).parent().find('.replies')[0].id = '1';
                }
            }
        });


    });




    /*--------------------------------------
     #State Management
     --------------------------------------*/

    $( 'main' ).on( 'click', 'textarea', function() {
        $( this ).parents( 'form' ).addClass( 'expand' );
    } );

    var userEx = {
        handle : "Crisco",
        img : "",
        _id : "23"
    };

    $( '.tweets' ).on( 'click', '.thread > .tweet', function() {
        $( this ).parents( '.thread' ).toggleClass( 'expand' );

    });


    /*--------------------------------------
     #Templating
     --------------------------------------*/

    /**
     * Compile Templates
     */
    var tweet   = Handlebars.compile( $( '#template-tweet' ).html() );
    var compose = Handlebars.compile( $( '#template-compose' ).html() );
    var thread  = Handlebars.compile( $( '#template-thread' ).html() );

    /**
     * Create New Tweet

    function renderTweet( User, message ) {
        var data = {
            handle : User.handle,
            img : User.img,
            message : message,
            ID : User._id
        };
        return tweet( data );
    };
    */

    function renderTweet(User) {
        var data = {
            handle : User.Author,
            img : "",
            message : User.Post_Content,
            ID : User._id
        };
        return tweet( User );
    };



    /**
     * Compose Area
     */
    function renderCompose() {
        return compose();
    }

    /**
     * Create a New Thread
     */
    function renderThread( data) {
        var getTweet   = renderTweet(data);
        var getCompose = renderCompose();

        var getThread = {
            tweetTemplate : getTweet,
            composeTemplate : getCompose
        };
        return thread( getThread );
    }

    /*--------------------------------------
     #Composition

            $( this ).parent().append( renderTweet( User, message ) );
        }

        $( 'textarea' ).val( '' );
        $( 'form' ).removeClass( 'expand' );
    } );

    */


    $( document ).on( 'submit', 'form', function() {
        event.preventDefault();
        message = $( 'textarea', this ).val();

        var data = {
            Author: "Crisco",
            _id: ";lkasjdflka;sdjf",
            Post_Content: message,
            img: ""
        };

        if ( $( this ).parent( 'header' ).length ) {
            $( '.tweets' ).append( renderThread( data ) );
            postFormFilled();
        } else {
            $( this ).parent().append( renderTweet( data ) );

            // Code to retrieve date
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var timeZone = new Date('Dec 29 2020 19:00:00 CST');

            // Code to retrieve time
            var hour = timeZone.getHours();
            var minutes = d.getMinutes();
            var am_pm = "";
            // Convert military time and store hour, minutes, am/pm
            if(d.getHours >= 0 && d.getHours <= 12)
            {
            am_pm = "AM";
            } else {
            am_pm = "PM";
            }

            //Get parent post ID
            var parentID = $(this).parent().parent().find(".tweet")[0].id;

            // Store all the post data in an array.
            var formArray = [message, userEx.handle, month, day, year, hour, minutes, am_pm, parentID];

            // Send post data to database.
            socket.emit("post-button", (formArray));

        }

        $( 'textarea' ).val( '' );
        $( 'form' ).removeClass( 'expand' );
    });


    function postFormFilled(){
        // Code to retrieve date
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var timeZone = new Date('Dec 29 2020 19:00:00 CST');

        // Code to retrieve time
        var hour = timeZone.getHours();
        var minutes = d.getMinutes();
        var am_pm = "";
        // Convert military time and store hour, minutes, am/pm
        if(d.getHours >= 0 && d.getHours <= 12)
        {
          am_pm = "AM";
        } else {
          am_pm = "PM";
        }

        //Get parent post ID
        var parentID = $(this).parent().find(".tweet");

        // Store all the post data in an array.
        var formArray = [message, userEx.handle, month, day, year, hour, minutes, am_pm, parentID];

        // Send post data to database.
        //socket.emit("post-button", (formArray));


        // ***TEST***
        console.log(parentID.id);
      }

} );
