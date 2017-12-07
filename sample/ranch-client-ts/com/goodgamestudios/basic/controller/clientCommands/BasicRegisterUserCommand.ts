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


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { BasicC2SRegisterUserVO } from "../commands/vo/BasicC2SRegisterUserVO";
	import { BasicRequiredRegistrationFieldsVO } from "../commands/vo/BasicRequiredRegistrationFieldsVO";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicTrackingStringComposer } from "../../tracking/BasicTrackingStringComposer";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { GGSCountryController } from "../../../language/countryMapper/GGSCountryController";
	import { error } from "../../../logging/error";
	import { TimezoneUtil } from "../../../utils/TimezoneUtil";

	export class BasicRegisterUserCommand extends SimpleCommand
	{
		/*override*/ /*final*/ public execute( commandVars:Object = null ):void
		{
			// Retrieve required fields
			var requiredRegistrationFields:BasicRequiredRegistrationFieldsVO = this.parseCommandVariables( commandVars );

			// Save data
			this.saveDataInCookie();
			this.saveAccountInUserData( requiredRegistrationFields.username, requiredRegistrationFields.password );

			// Execute server command
			var registerVO:BasicC2SRegisterUserVO = this.composeRegisterUserVO( requiredRegistrationFields );
			this.sendRegisterUserCommand( registerVO );
		}

		protected get registrationVOClass():Object
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
		protected parseCommandVariables( commandVars:Object = null ):BasicRequiredRegistrationFieldsVO
		{
			// override required
			throw new Error( "You must implement parseCommandVariables()" );
		}

		private composeRegisterUserVO( requiredRegistrationFields:BasicRequiredRegistrationFieldsVO ):BasicC2SRegisterUserVO
		{
			try
			{
				var registerVO:BasicC2SRegisterUserVO = BasicC2SRegisterUserVO( new this.registrationVOClass() );
			}
			catch (e:TypeError)
			{
				error( "TypeError" );
			}

			registerVO.username = requiredRegistrationFields.username;
			registerVO.email = requiredRegistrationFields.email;
			registerVO.password = requiredRegistrationFields.password;
			registerVO.accountId = this.env.accountId;
			registerVO.ggsLanguageCode = GGSCountryController.instance.currentCountry.ggsLanguageCode;
			registerVO.referrer = this.env.referrer;
			registerVO.distributorId = Number( this.env.distributorId );
			registerVO.connectionTime = BasicModel.smartfoxClient.connectionTime;
			registerVO.roundTripTime = BasicModel.smartfoxClient.roundTripTime;
			registerVO.campaignVars = BasicTrackingStringComposer.composeVarDataForRegistration( requiredRegistrationFields.email, this.env.referrer );
			registerVO.campaignVars_adid = this.env.campainVars.aid;
			registerVO.campaignVars_lp = this.env.campainVars.lp;
			registerVO.campaignVars_creative = this.env.campainVars.creative;
			registerVO.campaignVars_partnerId = this.env.campainVars.partnerId;
			registerVO.campaignVars_websiteId = this.env.urlVariables.websiteId;
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
		protected sendRegisterUserCommand( registerVO:BasicC2SRegisterUserVO ):void
		{
			// override required
			throw new Error( "You must implement sendRegisterUserCommand()" );
		}

		private saveDataInCookie():void
		{
			this.saveCurrentCountryInNetworkCookie();
			this.saveGameDataInCookie();
		}

		private saveCurrentCountryInNetworkCookie():void
		{
			BasicModel.localData.saveCountryData( GGSCountryController.instance.currentCountry.ggsCountryCode );
		}

		/**
		 * Hook method for storing game specific cookie data
		 */
		protected saveGameDataInCookie():void
		{
			// override
		}

		private saveAccountInUserData( username:string, password:string ):void
		{
			BasicModel.userData.loginName = username;
			BasicModel.userData.loginPwd = password;
		}

		public /*final*/ get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
