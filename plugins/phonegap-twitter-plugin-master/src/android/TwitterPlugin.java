
package org.phonegap.plugins.twitter;

import java.io.File;
import java.net.URI;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import twitter4j.Status;
import twitter4j.StatusUpdate;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;

public class TwitterPlugin extends CordovaPlugin {
	
	private String consumerKey;
	private String consumerSecret;
	private String callbackUrl;
	
	private RequestToken requestToken = null;
	private AccessToken accessToken = null;
	private CallbackContext ctx;
	private final String TAG = "TwitterPlugin";
	
	@Override
    public boolean execute(String action, final JSONArray args, CallbackContext callbackContext) throws JSONException {

		ctx = callbackContext;
		
        if (action.equals("init")) {

        	consumerKey = args.getJSONObject(0).getString("consumerKey");
        	consumerSecret = args.getJSONObject(0).getString("consumerSecret");
        	callbackUrl = args.getJSONObject(0).getString("callbackUrl");
        	
    		callbackContext.success();
    		
    		return true;
    		
        } else if (action.equals("getRequestToken")) {
            
        	cordova.getThreadPool().execute(new Runnable() {
                public void run() {
            		try {
            			Twitter twitter = new TwitterFactory().getInstance();
            			twitter.setOAuthConsumer(consumerKey, consumerSecret);
            			requestToken  = twitter.getOAuthRequestToken();
            			String requestUrl = requestToken.getAuthorizationURL();

            			ctx.success(requestUrl);
            		} catch (TwitterException e) {
            			e.printStackTrace();
            			ctx.error(e.getErrorMessage());
            		} catch (Exception e) {
            			e.printStackTrace();
            			ctx.error(e.getMessage());
            		}                	
                }
        	});
					
			return true;
            
        } else if (action.equals("getAccessToken")) {
        	
        	cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                	try {
                		
            			Twitter twitter = new TwitterFactory().getInstance();
            			twitter.setOAuthConsumer(consumerKey, consumerSecret);

        				accessToken = twitter.getOAuthAccessToken(requestToken, args.getString(0));
        				
        				// return this details to js
        				JSONObject json = new JSONObject();
        				json.put("oauth_token", accessToken.getToken());
        				json.put("oauth_token_secret", accessToken.getTokenSecret());
        				json.put("user_id", accessToken.getUserId());
        				json.put("screen_name", accessToken.getScreenName());
        				
        				ctx.success(json);
        			} catch (TwitterException e) {
        				e.printStackTrace();
        				ctx.error(e.getErrorMessage());
        			} catch (Exception e) {
        				ctx.error(e.getMessage());
        			}                	
                }
        	});

        	return true;
        	
        } else if (action.equals("postTweet")) {
        	
        	cordova.getThreadPool().execute(new Runnable() {
                public void run() {
        			try {
        				StatusUpdate statusUpdate = new StatusUpdate(args.getJSONObject(0).getString("message"));

        				// check of media path
        				if (args.getJSONObject(0).has("mediaPath")) {
            				File file = new File(args.getJSONObject(0).getString("mediaPath"));
            				statusUpdate.setMedia(file);
        				}
        				
        				Twitter twitter = new TwitterFactory().getInstance();
            			twitter.setOAuthConsumer(consumerKey, consumerSecret);
            			twitter.setOAuthAccessToken(accessToken);
        				twitter.updateStatus(statusUpdate);
        				
        				ctx.success();
        			} catch (TwitterException e) {
        				e.printStackTrace();
        				ctx.error(e.getErrorMessage());
        			} catch (JSONException e) {
        				e.printStackTrace();
        				ctx.error(e.getMessage());
        			} catch (Exception e) {
        				ctx.error(e.getMessage());
        			}                	
                }
        	});
					
			return true;
			
        }
        
        return false;  // Returning false results in a "MethodNotFound" error.
    }
	
}
