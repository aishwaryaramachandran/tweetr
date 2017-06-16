$(document).ready(function(){

  // This function re-encodes text so that unsafe characters are
  //converted to safe "encoded" representation and added to the template of the post tweet

  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  // A function that takes an object and
  //returns an <article> element that has the entire HTML structure of a typical tweet.

  function createTweetElement(tweets){
    var tweetContent  = tweets.content.text;
    var tweetHandle    = tweets.user.handle;
    var tweetUsername  = tweets.user.name;
    var tweetAvatar    = tweets.user.avatars.regular;
    var tweetCreatedAt = moment(tweets.created_at).fromNow();

    return `<article class="tweet">
              <header>
                <img src= "${tweetAvatar}"/>
                <h3>${tweetUsername}</h3>
                <h4 class ="twitter-handle">"${tweetHandle}"s</h4>
              </header>
              <content class="tweet-content">
                <p>
                  ${escape(tweetContent)}
                </p>
              </content>
              <footer>
                <h4>${tweetCreatedAt}</h4>
                <i class="fa fa-retweet" aria-hidden="true"></i>
                <i class="fa fa-heart" aria-hidden="true"></i>
                <i class="fa fa-flag" aria-hidden="true"></i>
              </footer>
            </article>`;
  }

//The function takes in an array of tweet objects
//and  prepends each one to the existing list of tweet posts

  function renderTweets(tweets) {
    for(let i= 0; i< tweets.length; i++) {
      var $tweet = createTweetElement(tweets[i]);
      $('#tweet-container').prepend($tweet)
    }
  }

// function that uses ajax to GET tweets as a JSON object
//from http://localhost:8080/tweets page
  function loadTweets(){
    $.ajax({
      url: '/tweets',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        renderTweets(data);
      }
    });
  }

  loadTweets();

  //The below feature toggles the tweet composer form

  $('.tweet-compose').on('click', function(event){
    $('.new-tweet').slideToggle();
    $('textarea').focus();

  })

  //Prevents defaut behaviour on form submission
  //Value of the text area is serialized
  //Ajax used to Post input from the form using the preset tweet template created with CSS.
  //Error: if text area length is 0 or above 140 on submission
  //textarea and counter reset after tweet is posted


  $('form').submit(function(event) {
    event.preventDefault();

    var textarea = $(this).find('textarea');
    var text = textarea.val();
    var formInput = $(this).serialize();
    $('.error-message').addClass('hidden');

    if (text.length === 0) {
      $('#empty-tweet').removeClass('hidden');
    } else if (text.length > 140) {
      $('#over-limit-tweet').removeClass('hidden');
    } else {
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: formInput
      }).done(function(data){
        loadTweets();
        $('textarea').val('');
        $('.new-tweet .counter').text(140);
      }).error(function(err) {
        console.error(err);
      });
    }
  });
});
