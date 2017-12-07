/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 24.07.13, 09:14
 *
 * $URL$
 * $Rev$
 * $Author$
 * $Date$
 * $Id$
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.commands.vo.BasicC2SRegisterUserVO;
	import com.goodgamestudios.basic.controller.commands.vo.BasicRequiredRegistrationFieldsVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.tracking.BasicTrackingStringComposer;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.logging.error;
	import com.goodgamestudios.utils.TimezoneUtil;

	public class BasicRegisterUserCommand extends SimpleCommand
	{
		override final public function execute( commandVars:Object = null ):void
		{
			// Retrieve required fields
			var requiredRegistrationFields:BasicRequiredRegistrationFieldsVO = parseCommandVariables( commandVars );

			// Save data
			saveDataInCookie();
			saveAccountInUserData( requiredRegistrationFields.username, requiredRegistrationFields.password );

			// Execute server command
			var registerVO:BasicC2SRegisterUserVO = composeRegisterUserVO( requiredRegistrationFields );
			sendRegisterUserCommand( registerVO );
		}

		protected function get registrationVOClass():Class
		{
			return BasicC2SRegisterUserVO;
		}

		/**
		 * Parses game specific command variables.
		 * Must be implemented!
		 *
		 * @param commandVars
		 * @return BasicRequiredRegistrationFieldsVO: A VO with the required fields
		 */
		protected function parseCommandVariables( commandVars:Object = null ):BasicRequiredRegistrationFieldsVO
		{
			// override required
			throw new Error( "You must implement parseCommandVariables()" );
		}

		private function composeRegisterUserVO( requiredRegistrationFields:BasicRequiredRegistrationFieldsVO ):BasicC2SRegisterUserVO
		{
			try
			{
				var registerVO:BasicC2SRegisterUserVO = BasicC2SRegisterUserVO( new registrationVOClass() );
			}
			catch (e:TypeError)
			{
				error( "TypeError" );
			}

			registerVO.username = requiredRegistrationFields.username;
			registerVO.email = requiredRegistrationFields.email;
			registerVO.password = requiredRegistrationFields.password;
			registerVO.accountId = env.accountId;
			registerVO.ggsLanguageCode = GGSCountryController.instance.currentCountry.ggsLanguageCode;
			registerVO.referrer = env.referrer;
			registerVO.distributorId = int( env.distributorId );
			registerVO.connectionTime = BasicModel.smartfoxClient.connectionTime;
			registerVO.roundTripTime = BasicModel.smartfoxClient.roundTripTime;
			registerVO.campaignVars = BasicTrackingStringComposer.composeVarDataForRegistration( requiredRegistrationFields.email, env.referrer );
			registerVO.campaignVars_adid = env.campainVars.aid;
			registerVO.campaignVars_lp = env.campainVars.lp;
			registerVO.campaignVars_creative = env.campainVars.creative;
			registerVO.campaignVars_partnerId = env.campainVars.partnerId;
			registerVO.campaignVars_websiteId = env.urlVariables.websiteId;
			// Timezone will send to the server which executes the registration tracking event.
			// That means the timezone must be in the tracking format.
			registerVO.timezone = TimezoneUtil.getTrackingTimezone();

			// Executes game specific stuff
			registerVO.initialize();

			return registerVO;
		}

		/**
		 * Sends the register command to the server (game specific)
		 * Must be implemented!
		 *
		 * @param registerVO
		 */
		protected function sendRegisterUserCommand( registerVO:BasicC2SRegisterUserVO ):void
		{
			// override required
			throw new Error( "You must implement sendRegisterUserCommand()" );
		}

		private function saveDataInCookie():void
		{
			saveCurrentCountryInNetworkCookie();
			saveGameDataInCookie();
		}

		private function saveCurrentCountryInNetworkCookie():void
		{
			BasicModel.localData.saveCountryData( GGSCountryController.instance.currentCountry.ggsCountryCode );
		}

		/**
		 * Hook method for storing game specific cookie data
		 */
		protected function saveGameDataInCookie():void
		{
			// override
		}

		private function saveAccountInUserData( username:String, password:String ):void
		{
			BasicModel.userData.loginName = username;
			BasicModel.userData.loginPwd = password;
		}

		public final function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}