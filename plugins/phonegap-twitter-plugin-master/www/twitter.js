
var twitter = {
	initObject: null,
	accessToken:null,

    init: function(obj) {
		cordova.exec(function(e) {
						initObject = obj;
						
						console.log("Twitter init successfully...");
					 }, function(e) { console.log("Twitter init failed") }, 'TwitterPlugin', "init", [obj]);
    },

	login: function(successCallback, failureCallback) {

		var showLoginWindow = function(url) {
			var ref = null;
			var loadStart = function(e) {
				
				console.log("url:" + e.url);
				console.log("initObject.callbackUrl:" + initObject.callbackUrl);
				if (e.url.match(initObject.callbackUrl)) {
					ref.close();	// close our window
										
					console.log("Twitter callbackUrl matched...");

					var currentUrl = e.url;
					var query = currentUrl.match(/oauth_verifier(.+)/);
					for (var i = 0; i < query.length; i++) {
						parameter = query[i].split("=");
						if (parameter.length === 1) {
							parameter[1] = "";
						}
					}
					
					console.log(parameter[1]);
					twitter.getAccessToken(parameter[1], successCallback, failureCallback);
				}
			};
			
			// open window to login
			ref = window.open(url, "_blank", "location=no");
			
			// check if the location the phonegap changes to matches our callback url or not
			ref.removeEventListener("loadstart", loadStart);	// remove encase added before (login failed)
			ref.addEventListener("loadstart", loadStart);		// add handler		
		};
		
		cordova.exec(function(e) {
						showLoginWindow(e);
					 }, failureCallback, 'TwitterPlugin', "getRequestToken", []);
					 

	},
	
	getAccessToken: function(oauth_verifier, successCallback, failureCallback) {
		cordova.exec(successCallback, failureCallback, "TwitterPlugin", "getAccessToken", [oauth_verifier]);
	},
	
	postTweet: function(e, successCallback, failureCallback) {
		cordova.exec(successCallback, failureCallback, "TwitterPlugin", "postTweet", [e]);
	}
	
}

module.exports = twitter;