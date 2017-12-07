/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 26.08.13, 10:08
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.utils.TimezoneUtil;

	/**
	 * Handles social login with an optional player name.
	 *
	 * Documentation see:
	 * https://sites.google.com/a/goodgamestudios.com/tech-wiki/java/gamedocumentation/core/events/newsocialloginevent
	 */
	public class BasicSocialLoginCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			BasicController.getInstance().onLogIn();

			var requestParameters:Array = [];

			// Social login name (taken from HTML embedding)
			requestParameters[ 0 ] = EnvGlobalsHandler.globals.pln;

			// Signature key (initially provided by HTML embedding). Contains a timestamp, may get timed out. If it is timed out the game server returns
			// Error code SOCIAL_LOGIN_KEYS_INVALID (10014)
			requestParameters[ 1 ] = EnvGlobalsHandler.globals.sig;
			requestParameters[ 2 ] = BasicModel.smartfoxClient.connectionTime;
			requestParameters[ 3 ] = BasicModel.smartfoxClient.roundTripTime;
			requestParameters[ 4 ] = EnvGlobalsHandler.globals.referrer;
			requestParameters[ 5 ] = EnvGlobalsHandler.globals.networkId;
			requestParameters[ 6 ] = EnvGlobalsHandler.globals.accountId;

			// Support key (initially provided by HTML embedding). Contains a timestamp, may get timed out.
			requestParameters[ 7 ] = EnvGlobalsHandler.globals.suk;
			requestParameters[ 8 ] = TimezoneUtil.getTrackingTimezone();

			// Player name (optional)
			requestParameters[ 9 ] = BasicModel.socialData.displayNameExistingPlayer;

			// Add WebSiteID
			requestParameters[ 10 ] = EnvGlobalsHandler.globals.urlVariables.websiteId;

			// Add Login Source
			requestParameters[11] = EnvGlobalsHandler.globals.urlVariables.loginSource;

			info( "Social login, request parameters: " + requestParameters );

			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_NEW_LOGIN_SOCIAL, requestParameters );
		}
	}
}