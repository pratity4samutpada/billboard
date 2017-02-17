Billboard = {};
Billboard.transition = 500;

Billboard.init = function(){
	$(document).ready(function(){
		Billboard.start()
	}
	
)};


Billboard.start = function(){
    if($(".post-comments").length && $("#post-comments-all").has("#no-posts")){
            $("#no-posts").remove()};
    $(".comments").hide();
	$("#send-cancel-container").hide();
	$("#new-post-form").hide();
	$("#new-post").show();
	$("#send-new-post").prop('disabled',true);
	Billboard.bindEventListeners();
};

Billboard.bindEventListeners =function(){
	$("#new-post").off()
	        .on('click',Billboard.showNewPostBox)
	        .on({mouseenter:function(){$(this).find("i").addClass('pulse')},
	             mouseleave: function(){$(this).find("i").removeClass('pulse')}});
	$("#cancel-new-post").off().on('click',Billboard.cancelNewPost);
	$(".show-comments").off().on('click',Billboard.showComments);
	$(".cancel-new-comment").off().on('click', Billboard.cancelComment);
	$("#send-new-post").off().on('click',Billboard.sendNewPost);
	$(".send-new-comment").off().on('click',Billboard.sendNewComment);
	$(".new-post-input").off().on('keyup',Billboard.inputValidatePost);

};

Billboard.inputValidatePost=function(){
    var button = $("#send-new-post")
    var postTitle = $("#new-post-title");
    var postAuthor = $("#new-post-author");
    var postContent = $("#new-post-content");
    if (postTitle.val() && postAuthor.val() && postContent.val()){
        button.prop('disabled',false)
    }else{
        button.prop('disabled',true)
    }
    }



Billboard.showNewPostBox = function(){
    $(this).hide();
	$("#send-cancel-container").fadeIn(Billboard.transition);
	$("#new-post-form").slideDown(Billboard.transition);
	$(".comments").hide();

};

Billboard.showComments = function(){
    $(this).closest('.post-comments').find('.comments').slideToggle();
    $("#new-post-form").slideUp(Billboard.transition);
    $("#send-cancel-container").hide();
	$("#new-post").fadeIn(Billboard.transition);
}

Billboard.cancelNewPost = function(){
    var title = $("#new-post-title");
	var author= $("#new-post-author");
	var content=$("#new-post-content");
	$("#new-post-form").slideUp(Billboard.transition);
	$("#send-cancel-container").hide();
	$("#new-post").fadeIn(Billboard.transition);
	Billboard.clearFields(title,author,content);
};

Billboard.cancelComment = function(){
    var comments = $(this).closest('.post-comments').find('.comments');
    comments.slideUp();
    var content = comments.find('.new-comment-text');
    var signature = comments.find('.user-signature');
    Billboard.clearFields(content,signature);
}

Billboard.clearFields = function(){
    for(var i =0; i <arguments.length; i++){
        arguments[i].val('');
    }
}

Billboard.sendNewPost = function(){
    var postTitle = $("#new-post-title");
    var postAuthor = $("#new-post-author");
    var postContent = $("#new-post-content");

    $.ajax({
        url: "newpost",
        type: "POST",
        data: {
            post_title: postTitle.val(),
            post_author: postAuthor.val(),
            post_content: postContent.val()
        },

        success: function(result){
        Billboard.clearFields(postTitle,postAuthor,postContent);
        $("#post-comments-all").append(result);
        Billboard.start();
        }

})}

Billboard.sendNewComment = function(){
    var button = $(this)
    var postId = button.val()
    var commentAuthor = button.closest('.new-comment-form').find('.user-signature')
    var commentContent = button.closest('.new-comment-form').find('.new-comment-text')

    $.ajax({
        url: "newcomment",
        type: "POST",
        data: {
            post_id: postId,
            comment_author: commentAuthor.val(),
            comment_content: commentContent.val()
        },
        success: function(result){
        Billboard.clearFields(commentAuthor,commentContent)
        $("#comments_post_"+postId+">ul").append(result)

        }

    })
}



Billboard.init();


//Ajax CSRF.

$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});