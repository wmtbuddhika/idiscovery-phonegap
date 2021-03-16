Phonegap-Twitter-Plugin
=======================

Twitter plugin for Phonegap 3 (tested with 3.4.0) using Twitter4j and InAppBrowser to prompt a user to login to an application and post tweets.

Required:
- Twitter4j Core Library must be added to your android project. You can download the latest version from http://twitter4j.org/. I have tested it with version 4.0.1.
- InAppBrowser Plugin must be added to your project. You can install that by following the instructions here http://docs.phonegap.com/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html


Initialize

First you must create and setup your app at https://dev.twitter.com//. Once done call the following method within your onDeviceReady method, like so:

        // initialize twitter
        twitter.init({
            consumerKey: "YOUR_CONSUMER_KEY",
            consumerSecret: "YOUR_CONSUMER_SECRET",
            callbackUrl: "YOUR_APP_CALLBACK_URL"
        });


Prompting user for login

        twitter.login(function(token) {
            // success

        }, function(e) {
            // error
        });
        
The returned token object contains the following properties

        (String) oauth_token = oAuth Token 
        (String) oauth_token_secret = oAuth Token Secret
        (Long)   user_id = userId of logged in user
        (String) screen_name = screenName of the logged in user


Post a tweet

Accepts an object with the properties 

        message = String of message to send
        mediaPath = virtual path of media you want to post (optional)


Example code
============

This code will prompt the user to login, and upon a successful login, it will post a tweet

	twitter.login(function(token) {
		// login successful
	        twitter.postTweet({
        	    message: "I am tweeting using Twitter Phonegap Plugin"
	        }, 
        	function() {
	            alert("tweet successful");
        	),
	        function(e) {
        	    alert("error occurred while tweeting");
	        });
	}, function(e) {
		// error logging in
	});