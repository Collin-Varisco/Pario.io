
$( function() {
     var socket = io();
    // Load posts on feed.
   /* socket.emit("load-posts");
    
    // Append posts from database onto html 
    socket.on("display-posts", (result) => {
        for(var i = 0; i < result.length; i++){

            if (result[i].Parent_Comment_ID == "") {
                $( '.tweets' ).append( renderThread( result[i].Author, result[i].Post_Content ) );

                    var parentID = result[i]._id;
                    for(var j = 0; j < result.length; j++){
                        if(parentID == result[j].Parent_Comment_ID){
                            var complete = "@" + result[j].Author + " " + result[j].Post_Content;
                            $('.tweets').append(renderThread( result[j].Author, complete));
                        }
                    }
            } 
            /*
            if(result[i].Parent_Comment_ID != ""){
                var finalContent = getParentName(result[i].Parent_Content_ID) + result[i].Post_Content;
                $( '.tweets' ).append( renderThread(result[i].Author, finalContent));
            } else {
                $( '.tweets' ).append( renderThread( result[i].Author, result[i].Post_Content ) );
            }
        }
        
        for(var j = 0; j < result.length; j++){
            var parentID = result[j].Parent_Comment_ID;
            for(var i = 0; i < result.length; i++){
                if(parentID == result[i]._id){
                    var complete = "@" + result[i].Author + " " + result[j].Post_Content;
                    $('.tweets').append(renderThread( result[i].Author, complete));
                }
            }
        }
    });*/
    // Get Username of the parent
    function getParentName(id){
        socket.emit("get_parent_name", (id));
        var parentName = "";
        socket.on("receive_parent_name", (result) => {
            var newPost = "@" + result.Author + " | ";
            parentName = newPost;
        });
        var parent = parentName;
        return parent;
    }

    /*--------------------------------------
     #User Object
     --------------------------------------*/

    var User = {
        handle : '@bebaps',
        img : 'bebaps.jpg',
    };

    /*--------------------------------------
     #State Management
     --------------------------------------*/
    //CLICKABLE
    
    $( 'main' ).on( 'click', 'textarea', function() {
        $( this ).parents( 'form' ).addClass( 'expand' );
    } );
    
    $( '.tweets' ).on( 'click', '.thread > .tweet', function() {
        $( this ).parents( '.thread' ).toggleClass( 'expand' );

    } );


    /*--------------------------------------
     #Templating
     --------------------------------------*/

    /**
     * Compile Templates
     */
    var tweet   = Handlebars.compile( $( '#template-tweet' ).html() );
    var compose = Handlebars.compile( $( '#template-compose' ).html() );
    var thread  = Handlebars.compile( $( '#template-thread' ).html() );
    
    var source = $("#template-tweet").html(); 
    var template = Handlebars.compile(source);
    var comment = Handlebars.compile( $( '#template-comment' ).html() );



    $(document).on('click', '.tweet', function() {
        socket.emit("get-comments");
        $(this).parent().append(compose());
        socket.on("display-comments", (result) => {
            console.log(result[0]);
            //var html = template(result);
            //$(this).parent().append($('.replies').html(html)));
            //$(this).parent().append(renderCompose());
            //renderTweet(result);
            //renderCompose();
            //renderThread(result.Author, result.Post_Content)

            if ( $( this ).parent( 'header' ).length ) {
                $( '.tweets' ).append( renderThread( User, message ) );
            } else {
                var html = template(result);

                $( this ).parent().append($('thread').html(html));
                //$(this).parent().append(renderCompose());
                //$( this ).parent().append( renderThread(result, result.Post_Content));
            }
        });
    });

    

    /**
     * Create New Tweet
     */
    // OG | function renderTweet( User, message ) {
    function renderTweet(User, message){
        var data = {
            // OG: handle : User.handle
            handle : User.Author,

            //OG: img : User.img,
            img : "",
           
            //OG: message : message
            message : message
        };
        return tweet( data );
    };


    /**
     * Comment template
     */
    function renderComments(result) {
        var html = template(result);
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
    function renderThread( User, message ) {
        var getTweet   = renderTweet( User, message );
        var getCompose = renderCompose();

        var getThread = {
            tweetTemplate : getTweet,
            composeTemplate : getCompose
        };
        return thread( getThread );
    }

    /* ----------------------------------------
        #Append comments
    ------------------------------------------*/
    /*
    $(document).on( 'click', '.thread', function(event) {
        event.preventDefault();
        socket.emit("get-comments");
         
        socket.on("display-comments", (result) => {
            for(var i = 0; i < 5; i++){

                if ( $( this ).parent( 'header' ).length ) {
                $( '.tweets' ).append( renderThread(result[i].Author, result[i].Post_Content ) );
                } else {
                    $( this ).parent().append( renderTweet( result[i].Author, result[i].Post_Content ) );
                }

                $( 'textarea' ).val( '' );
                $( 'form' ).removeClass( 'expand' );
            }        
        });

        $( 'textarea' ).val( '' );
        $( 'form' ).removeClass( 'expand' );
        
    });
    */

    /*--------------------------------------
     #Composition
     --------------------------------------*/

    $( document ).on( 'submit', 'form', function() {
        event.preventDefault();
        message = $( 'textarea', this ).val();




        if ( $( this ).parent( 'header' ).length ) {
            $( '.tweets' ).append( renderThread( User, message ) );
        } else {
            $( this ).parent().append( renderTweet( User, message ) );
        }

        $( 'textarea' ).val( '' );
        $( 'form' ).removeClass( 'expand' );
    } );

} );
