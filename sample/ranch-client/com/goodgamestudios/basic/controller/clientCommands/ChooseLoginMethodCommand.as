/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 18.09.13, 13:24
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
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.info;

	public class ChooseLoginMethodCommand extends SimpleCommand
	{
		override final public function execute( commandVars:Object = null ):void
		{
			var userForcedDisconnect:Boolean = BasicModel.smartfoxClient.userForcedDisconnect;

			if (!userForcedDisconnect)
			{
				var autoLoginPossible:Boolean;
				var autoLoginReason:String;

				// Is a social login possible?
				// With as social login the client always gets passed a "pln" and a "sig" via Flashvars.
				// Possible use cases:
				// 1. Client is embedded in a social network. The "pln"/"sig" are passed by the embedding HTML file.
				// 2. Client is beeing requested via the LoginTool. The "pln"/"sig" are appended as GET parameters to the URL, there is no outer HTML file, the loader SWF is requested directly.
				// 3. Client is beeing requested via the SupportBackend (analog to bullet 2)
				if (isAutoLoginInSocialNetworkPossible())
				{
					autoLoginReason = "With social login account.";
					autoLoginPossible = true;
				}
				// Account in cookie saved?
				else if (isLoginPossibleWithCookieAccount())
				{
					autoLoginReason = "With account stored in SharedObject.";
					autoLoginPossible = true;
				}
				// Is an alternative login method available? E.g. facebook
				else if (alternativeLoginPossible())
				{
					// If the login is done alternatively, ignore the default login
					return;
				}

				// No matter which auto login would have been possible:
				// If the age gate validation is active and was not validated yet
				// forbid a auto login.
				if(!isAgeGateValid())
				{
					var ageGateInfo:String;
					if(autoLoginPossible)
					{
						ageGateInfo = "Auto login would have been possible, but age gate validation is not complete.";
					}
					else
					{
						ageGateInfo = "AgeGate validation is not complete. No login possible.";
					}

					info( ageGateInfo );

					BasicModel.ageGateData.autoLoginTryFailed = autoLoginPossible;
					autoLoginPossible = false;
				}

				if (autoLoginPossible)
				{
					info( "Do autologin: " + autoLoginReason );
					login();
					return;
				}
			}

			info( "No auto login possible, show startscreen." );

			handleAutoLoginImpossible();
		}

		private function isAgeGateValid():Boolean
		{
			// If age gate is not active, all fine here
			if(!BasicModel.ageGateData.isAgeGateActive)
			{
				return true;
			}
			else
			{
				if(BasicModel.ageGateData.validationSucceeded)
				{
					return true;
				}
			}

			return false;
		}

		private function handleAutoLoginImpossible():void
		{
			BasicLayoutManager.getInstance().state = BasicLayoutManager.STATE_STARTSCREEN;
		}

		/**
		 * Override this method if your game supports an alternative login procedure e.g. a facebook connect login.
		 * Return 'true' if there is an alterantive login available, 'false' if not.
		 *
		 * @return Flag that indicates if an alternative login method is available. Default is false.
		 */
		protected function alternativeLoginPossible():Boolean
		{
			return false;
		}

		private function isAutoLoginInSocialNetworkPossible():Boolean
		{
			var socialName:String = BasicModel.socialData.displayNameExistingPlayer;

			if (socialName && socialName != "")
			{
				// FLC-1036: If the current network has only one instance but several countries an auto login should be avoided.
				// Reason: If a user changes the country to another one than the country detection offered him and the user's SharedObject gets deleted
				// he would never have a chance to change back to the language he had chosen originally. Therefore in this case every time the startscreen is being displayed.
				var instanceAmount:int = BasicModel.instanceProxy.instanceMap.length;
				var countryAmount:int = BasicModel.instanceProxy.instanceMap[0].countries.length;

				if(instanceAmount == 1 && countryAmount > 1)
				{
					return false;
				}

				return true;
			}
			return false;
		}

		private function isLoginPossibleWithCookieAccount():Boolean
		{
			var userNameCookie:String = BasicModel.localData.readLoginDataUsername();
			var passwordCookie:String = BasicModel.localData.readLoginDataPass();

			if (hasAccountSavedInCookie( userNameCookie, passwordCookie ))
			{
				// Take current username/password from cookie
				BasicModel.userData.loginName = userNameCookie;
				BasicModel.userData.loginPwd = passwordCookie;

				return true;
			}

			return false;
		}

		private function hasAccountSavedInCookie( userNameCookie:String, passwordCookie:String ):Boolean
		{
			var hasAccountSavedInCookie:Boolean = userNameCookie && userNameCookie != "" && passwordCookie && passwordCookie != "";

			return hasAccountSavedInCookie;
		}

		private function login():void
		{
			var loginCommand:String;

			if (EnvGlobalsHandler.globals.isSSO && !EnvGlobalsHandler.globals.useLegacySocialRegistration)
			{
				loginCommand = BasicController.COMMAND_SOCIAL_LOGIN;
			}
			else
			{
				loginCommand = BasicController.COMMAND_LOGIN;
			}

			// Executes desired login command
			CommandController.instance.executeCommand( loginCommand );
		}
	}
}
