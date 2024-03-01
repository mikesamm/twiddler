
$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  // add button inside a button div
  const $buttonDiv = $('<div id=new-tweets-button>');
  $body.prepend($buttonDiv);
  $buttonDiv.append('<button id=new-tweets>show latest tweets</button>');

  // add a form to accept a username and tweet
  // declare form div and form elements
  const $formDiv = $('<div id="tweet-form-container">');
  const $form = $('<form id=tweet-form>')
  const $button = $('<button id=submit-button>tweet</button>')
  const $formUserDiv = $('<div id=submit-user-div>')
  const $formMsgDiv = $('<div id=submit-msg-div>')
  const $formButtonDiv = $('<div id=submit-button-div>')
  const $formUserLabel = $('<label for=user-text>username:</label>');
  const $formUserText = $('<input type=text id=user-text>');
  const $formMsgLabel = $('<label for=msg-text>tweet:</label>');
  const $formMsgText = $('<input type=text id="msg-text">');
  //  add a form div to house the form fields
  $body.prepend($formDiv);
  $formDiv.append($form);
  //    two text fields in the form
  $form.append($formUserDiv);
  $formUserDiv.append($formUserLabel);
  $formUserDiv.append($formUserText);
  $form.append($formMsgDiv);
  $formMsgDiv.append($formMsgLabel);
  $formMsgDiv.append($formMsgText);
  //    one button to submit the tweet
  $form.append($formButtonDiv);
  $formButtonDiv.append($button);


  // create a div for all of the tweets
  const $tweetsDiv = $('<div id=tweets>');
  $body.append($tweetsDiv);

  // create time variables
  let previousTime; // would equal time listed in the timeStamp div

  constructTweets = function(tweet) {
    // create a div and other elements for each tweet
    const $tweet = $('<div class=tweet></div>');
    const $userContainer = $('<span class=user></span>');
    const $message = $('<span class=message></span>');

    // create div after each tweet div for times
    const $times = $('<div class=times style=border: 2px solid blue>');
    const $timeStamp = $('<span class=timestamp></span>');
    const $timeago = $('<span class=timeago></span>');

    // text to go into tweet elements
    const username = `@${tweet.user}`;
    const message = `: ${tweet.message}`;

    // text (time) to go into time div
    const time = moment(); // TODO: might need to change to created_at parse
    const timeTweeted = moment().calendar(time); // ex: Today at 2:30 AM
    const timeago = moment().from(); // ex: a few seconds ago
    
    // add user and message to tweet div
    $tweet.append($userContainer);
    // $userContainer.append($user);
    $tweet.append($message);
    // add text to tweet elements
    $userContainer.text(username);
    $message.text(message);

    // construct times and their divs
    // add times container div
    $tweet.append($times);
    // add timestamp div to times div
    $times.append($timeStamp);
    // add timestamp
    $timeStamp.text(`${timeTweeted} `);
    // add timeago div to times div
    $times.append($timeago);
    // add timeago
    $timeago.text(`${timeago}`);

    // set previousTime to the milliseconds of the tweet's created_at
    previousTime = tweet.created_at.getTime();

    return $tweet;
  };

  // deliver new tweets
  const newTweets = function() {
    // declare tweets variable
    let $tweets;

    // check time to determine which tweets are prepended to the body
    // if previous time is undefined
    if (!previousTime) {
      //   map the whole streams.home
      $tweets = streams.home.map((tweet) => {
        return constructTweets(tweet);
      });
    } else {
      //   filter out those with created_at later than previous time
      let latestTweets = streams.home.filter((tweet) => tweet.created_at > previousTime);
      //   map filtered array
      $tweets = latestTweets.map((tweet) => {
        return constructTweets(tweet);
      });

    }

    // append new tweets to tweets div
    $tweetsDiv.prepend($tweets);
  };
  newTweets();

  const userTweets = function(username) {
    // change the whole body of the html to the user's stream

    // include a button to "go back" at the top of the section
    //  change the new tweets button to "go back"?

    // clear the body tag
    // $body.html('');
    // declare tweets variable
    let $tweets;

    //   map the whole streams.users[username]
    $tweets = streams.users[username].map((tweet) => {
      return constructTweets(tweet);
    });

    // TODO: implement stream update like main stream? can re-use this logic below
    // check time to determine which tweets are prepended to the body
    // if previous time is undefined
    // if (!previousTime) {
    //   //   map the whole streams.home
    //   $tweets = streams.users[username].map((tweet) => {
    //     return constructTweets(tweet);
    //   });
    // } else {
    //   //   filter out those with created_at later than previous time
    //   let latestTweets = streams.users[username].filter((tweet) => tweet.created_at > previousTime);
    //   //   map filtered array
    //   $tweets = latestTweets.map((tweet) => {
    //     return constructTweets(tweet);
    //   });

    // }

    // append new tweets to tweets div
    $tweetsDiv.prepend($tweets);
  };

  const userSubmittedTweet = function(username) {
    let $tweet;
    let latestTweet = streams.users[username].length - 1;
    // set time property for new tweet
    streams.users[username][latestTweet].created_at = new Date();
    // construct tweet
    $tweet = constructTweets(streams.users[username][latestTweet]);


    // append new tweet to tweets div
    $tweetsDiv.prepend($tweet);
  };

  const usernameClick = function() {
    $('.user').on('click', function() {
      let username = this.innerText.slice(1);
      userTweets(username);
      // carry styling over
      $('.times').css('border', '2px solid blue');
      // carry usernameClick functionality
      usernameClick();
    });
  };

  // add click handler to user submitted tweet button
  const $submitButton = $('#submit-button');
  $submitButton.on('click', function() {
    // prevent form from refreshing page
    $('#tweet-form').submit(function(e){
      e.preventDefault();
    })
    // set window.visitor property
    window.visitor = $('#user-text').val();
    let username = window.visitor;
    if (!window.visitor) { 
      alert("Choose a username"); 
    }
    // if new username is not a stream.users property yet
    if (!streams.users[username]) {
      streams.users[username] = [];
    }
    // use writeTweet to create tweet
    writeTweet($('#msg-text').val());
    // add tweet to feed
    userSubmittedTweet(username);

    // carry click event handler to usernames
    usernameClick();
    // console.log(window.visitor, typeof window.visitor);
    // console.log($('#msg-text').val(), typeof $('#msg-text').val())
  })

  // add click handler to new tweets button
  const $tweetButton = $('#new-tweets');
  $tweetButton.on('click', function() {
    newTweets();
    // carry styling over
    $('.times').css('border', '2px solid blue');
    // carry click event handler to usernames
    usernameClick();
  });

  // add click event handler to usernames
  usernameClick();

  // how to show streams.users.(username) array when clicked?
  //  change body to show only (username)'s tweets
  //    when username clicked, it should trigger a function that changes the body of the html

  // add a box to certain divs
  $('#tweets').css('border', '2px solid red');
  $('#new-tweets-button').css('border', '2px solid red');
  $('.times').css('border', '2px solid blue');

});
