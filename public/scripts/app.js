$(document).ready(function(){

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createTweetElement(tweets){
  var tweetContent = tweets.content.text;
  var tweetHandle = tweets.user.handle;
  var tweetUsername = tweets.user.name;
  var tweetAvatar = tweets.user.avatars.regular;
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
        </article>`
};

function renderTweets(tweets) {
  for(let i= 0; i< tweets.length; i++){
  var $tweet = createTweetElement(tweets[i]);
  $('#tweet-container').prepend($tweet)

  }
}

function clearContents(element) {
  element.value = '';
}

function loadTweets() {
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

  $('.tweet-compose').on('click', function(event){
    $('.new-tweet').slideToggle();
    $('textarea').focus();

  })

  $('form').submit(function(event) {
    event.preventDefault();
    var textarea = $(this).find('textarea');
    var text = textarea.val();
    var formInput = $(this).serialize();
    $('.error-message').addClass('hidden');
    if(text.length === 0){
      $('#empty-tweet').removeClass('hidden');
      return;
    }
    if(text.length > 140){
      $('#over-limit-tweet').removeClass('hidden');
      return;

    }
    else {
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formInput
    }).done(function(data){
      loadTweets();
      textarea.val('');
    })

  }
});

});
