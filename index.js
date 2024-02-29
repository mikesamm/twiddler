
$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  // add button inside a button div
  const $buttonDiv = $('<div id=new-tweets-button>');
  $body.prepend($buttonDiv);
  $buttonDiv.append('<button id=new-tweets>New Tweets</button>');

  // create a div for all of the tweets
  const $tweetsDiv = $('<div id=tweets>');
  $body.append($tweetsDiv);

  // create time variables
  let previousTime; // would equal time listed in the timeStamp div


  // deliver new tweets
  const newTweets = function() {
    // declare tweets variable
    let $tweets;

    // data-generator will generate 10 tweets off the bat, but then each next call to tweet generator is wrapped with a timeout
    // the time of the initial tweets should be set so it can be checked

    // check time to determine which tweets are appended to the body
    // if previous time is undefined
    if (!previousTime) {
      //   map the whole streams.home
      $tweets = streams.home.map((tweet) => {
        // create a div for each tweet
        const $tweet = $('<div class=tweet></div>');
        // create div after each tweet div for timestamp
        const $times = $('<div class=times>');
        const $timeStamp = $('<div id=timestamp></div>');
        const $timeago = $('<div id=timeago></div>');
        // text to go into tweet div
        const text = `@${tweet.user}: ${tweet.message}`;
        // text (time) to go into time div
        const time = moment();
        const timeTweeted = moment().calendar(time); // ex: Today at 2:30 AM
        const timeago = moment().from();
        
        // add tweet text to tweet div
        $tweet.text(text);

        // construct times and their divs
        // add times container div
        $tweet.append($times);
        // add timestamp div to times div
        $times.append($timeStamp);
        // add timestamp
        $timeStamp.text(`${timeTweeted}`);
        // add timeago div to times div
        $times.append($timeago);
        // add timeago
        $timeago.append(timeago);
  
        // set previousTime to the milliseconds of the tweet's created_at
        previousTime = tweet.created_at.getTime();

        return $tweet;
      });
    } else {
      //   filter out those with created_at later than previous time
      let latestTweets = streams.home.filter((tweet) => tweet.created_at > previousTime);
      //   map filtered array
      $tweets = latestTweets.map((tweet) => {
        // create a div for each tweet
        const $tweet = $('<div class=tweet></div>');
        // create div after each tweet div for timestamp
        const $times = $('<div class=times>');
        const $timeStamp = $('<div id=timestamp></div>');
        const $timeago = $('<div id=timeago></div>');
        // text to go into tweet div
        const text = `@${tweet.user}: ${tweet.message}`;
        // text (time) to go into time div
        const time = moment();
        const timeTweeted = moment().calendar(time); // ex: Today at 2:30 AM
        const timeago = moment().from();
        
        // add tweet text to tweet div
        $tweet.text(text);

        // construct times and their divs
        // add times container div
        $tweet.append($times);
        // add timestamp div to times div
        $times.append($timeStamp);
        // add timestamp
        $timeStamp.text(`${timeTweeted}`);
        // add timeago div to times div
        $times.append($timeago);
        // add timeago
        $timeago.append(timeago);
  
        // set previousTime to the milliseconds of the tweet's created_at
        previousTime = tweet.created_at.getTime();

        return $tweet;
      });

    }

    // append new tweets to tweets div
    $tweetsDiv.prepend($tweets);
  };
  newTweets();

  // add click handler to new tweet button
  const $tweetButton = $('#new-tweets');
  $tweetButton.on('click', function() {
    newTweets();
  });

  // add a box to certain divs
  $('#tweets').css('border', '2px solid red');
  $('#new-tweets-button').css('border', '2px solid red');
  $('.times').css('border', '2px solid blue');

  // helper functions /////////////////////////////////////////////////////////


});
