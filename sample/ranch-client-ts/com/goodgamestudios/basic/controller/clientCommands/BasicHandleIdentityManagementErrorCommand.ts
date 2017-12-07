/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 20.06.13, 12:46
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { IdentityManagementConstants } from "../../constants/IdentityManagementConstants";
	import { BasicController } from "../BasicController";
	import { BasicDialogHandler } from "../../model/components/BasicDialogHandler";
	import { CommonDialogNames } from "../../view/CommonDialogNames";
	import { BasicMissingIDCheckDialogProperties } from "../../view/dialogs/BasicMissingIDCheckDialogProperties";
	import { BasicStandardOkDialogProperties } from "../../view/dialogs/BasicStandardOkDialogProperties";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { Localize } from "../../../core/localization/utils/Localize";
	import { debug } from "../../../logging/debug";
	import { warn } from "../../../logging/warn";

	export class BasicHandleIdentityManagementErrorCommand extends SimpleCommand
	{
		public static NAME:string = "BasicHandleIdentityManagementErrorCommand";

		constructor( singleExecution:boolean = false ){
			super( singleExecution );
		}

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var errorCode:number = Number( commandVars );

			debug( "execute() -> " + errorCode, commandVars );

			var errorTextId:string;

			switch (errorCode)
			{
				case IdentityManagementConstants.ERROR_VERIFICATION_FAILED:
					CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKING_SIREN24_GENERAL_VERIFICATION_ERROR );
					errorTextId = IdentityManagementConstants.TEXT_ID_SERVER_MISSING_KOREA_ID_CHECK_DATA;
					break;

				case IdentityManagementConstants.ERROR_SERVER_KOREA_ID_ALREADY_REGISTERED:
					CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKINg_SIREN24_ID_ALREADY_REGISTERED );
					errorTextId = IdentityManagementConstants.TEXT_ID_ERROR_KOREA_ID_ALREADY_REGISTERED;
					break;

				case IdentityManagementConstants.ERROR_CLIENT_REGISTER_AGE_CHECK_FAILED:
					CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKING_SIREN24_AGE_CHECK_FAILED_DURING_REGISTRATION );
					// Time is between 0:00h - 6:00h and user is too young
					errorTextId = IdentityManagementConstants.TEXT_ID_ERROR_REGISTER_AGE_CHECK_FAILED;
					break;

				case IdentityManagementConstants.ERROR_CLIENT_LOGIN_AGE_CHECK_FAILED:
					// Time is between 0:00h - 6:00h and user is too young
					errorTextId = IdentityManagementConstants.TEXT_ID_ERROR_LOGIN_AGE_CHECK_FAILED;
					break;

				case IdentityManagementConstants.ERROR_CLIENT_REGISTER_MISSING_KOREA_ID_CHECK:
					CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKING_SIREN24_MISSING_ID_CHECK_DATA );
					errorTextId = IdentityManagementConstants.TEXT_ID_ERROR_CLIENT_REGISTER_MISSING_KOREA_ID_CHECK;
					break;

				case IdentityManagementConstants.ERROR_SERVER_MISSING_KOREA_USER_DATA:
					errorTextId = IdentityManagementConstants.TEXT_ID_SERVER_MISSING_KOREA_ID_CHECK_DATA;
					break;
				case IdentityManagementConstants.ERROR_SERVER_NO_KOREA_USER_DATA_AVAILABLE:
					errorTextId = IdentityManagementConstants.TEXT_ID_ERROR_CLIENT_REGISTER_MISSING_KOREA_ID_CHECK;
					var errorIdCheckMessage:string = Localize.text( errorTextId );
					BasicDialogHandler.getInstance().registerDialogs( CommonDialogNames.KoreaMissingIdCheckDialog_NAME, new BasicMissingIDCheckDialogProperties( Localize.text( "generic_alert_watchout" ), errorIdCheckMessage ) );
					return;

				case IdentityManagementConstants.ERROR_CLIENT_REGISTER_NOT_ALLOWED_FOR_AGE:
					CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKING_SIREN24_REGISTER_NOT_ALLOWED_FOR_AGE );
					errorTextId = IdentityManagementConstants.TEXT_ID_ERROR_UNDER_TWELVE_CHECK;
					break;
				default:
					warn( "execute() -> Invalid errorCode: " + errorCode, commandVars );
					//Default error to prevent client crush.
					errorTextId = IdentityManagementConstants.TEXT_ID_SERVER_MISSING_KOREA_ID_CHECK_DATA;
					break;
			}

			var errorMessage:string = Localize.text( errorTextId );

			// Display error code in debug client
			if (process.env.debug)
			{
				errorMessage += ", " + errorCode;
			}

			BasicDialogHandler.getInstance().registerDialogs( CommonDialogNames.StandardOkDialog_NAME, new BasicStandardOkDialogProperties( Localize.text( "generic_alert_watchout" ), errorMessage ) );
		}
	}
