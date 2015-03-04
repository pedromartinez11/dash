window.fbAsyncInit = function() {
  FB.init({
    appId      : '903632352992329',
    xfbml      : true,
    version    : 'v2.2'
  });

  window.fb_update_score = function (score) {
    FB.api(
     'https://graph.facebook.com/me/scores',
     'post',
     { "score": score },
     function(response) {
       if (!response) {
         console.log('Error occurred.');
       } else if (response.error) {
         console.log(response.error);
       } else {
         console.log('score posted.');
       }
     }
    );
  }

  window.fb_update_leaderboard = function () {
      FB.api(
          "/903632352992329/scores",
          function (response) {
            $('#loading').hide();

            if (response && !response.error) {
              response = response.data;
              var length = response.length;
              var ranking = $('#ranking').empty();

              for (var i = 0; i < length; i++) {
                ranking.append(
                  '<tr>' + 
                    '<td>' + (i + 1) + '.</td>' +
                    '<td>' + response[i].user.name + '</td>' +
                    '<td style="text-align: center;">' + response[i].score + '</td>' +
                    '</tr>');
              }
            } else 
              $('#no_leaderboard').show();
          }
      );
  }

  function onLogin(response) {
    if (response.status == 'connected') {
      FB.api('/me?fields=first_name,picture', function(data) {
        var welcomeBlock = document.getElementById('user_name');
        welcomeBlock.innerHTML = data.first_name + ', ';
        // console.log(data.picture.data.url);
      });

      FB.api(
          "/me/scores",
          function (response) {
            if (response && !response.error) {
              BEST_SCORE = response.data[0].score;
              best.html(BEST_SCORE);
            }
          }
      );

      fb_update_leaderboard();
    }
  }

  // function onLogin(response) {
  //   if (response.status == 'connected') {
  //     FB.api(
  //       '/me/scores', 
  //       'post',
  //       {score: 100},
  //       function(response) {
  //         if (!response) {
  //            console.log('Error occurred.');
  //          } else if (response.error) {
  //            console.log(response.error.message);
  //          } else {
  //            console.log('gravou');
  //          }
  //       } 
  //     );

  //     FB.api('/903632352992329/scores', function(data) {
  //       console.log(data);
  //       var welcomeBlock = document.getElementById('user_name');
  //       welcomeBlock.innerHTML = data.user + ', ';
  //       // console.log(data.picture.data.url);
  //     });
  //   }
  // }

  FB.getLoginStatus(function(response) {
    // Check login status on load, and if the user is
    // already logged in, go directly to the welcome message.
    if (response.status == 'connected') {
      onLogin(response);
    } else {
      // Otherwise, show Login dialog first.
      FB.login(function(response) {
        onLogin(response);
      }, {scope: 'user_friends, email, publish_actions'});
    }
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));