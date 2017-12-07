

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { BasicController } from "../BasicController";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommonDialogNames } from "../../view/CommonDialogNames";
	import { BasicReconnectDialogProperties } from "../../view/dialogs/BasicReconnectDialogProperties";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { Localize } from "../../../core/localization/utils/Localize";

	export class BasicConnectionLostCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_DESTROY_GAME );
			this.layoutManager.state = BasicLayoutManager.STATE_CONNECT;

			if (BasicModel.smartfoxClient.userForcedDisconnect)
			{
				if (this.env.underAgeConnectionLost && this.env.isIdentityManagementActive)
				{
					CommandController.instance.executeCommand( BasicController.COMMAND_DESTROY_GAME );
					this.layoutManager.state = BasicLayoutManager.STATE_CONNECT;
					this.layoutManager.showDialog( CommonDialogNames.ReconnectDialog_NAME, new BasicReconnectDialogProperties( Localize.text( "generic_alert_information" ), Localize.text( "generic_alert_korea_logoutMessage" ), this.onReconnect, Localize.text( "generic_btn_reconnect" ) ) );
				}
				else
				{
					this.showForcedDisconnectDialog();
				}

			}
			else
			{
				this.showServerDisconnectDialog();
			}
		}

		protected showForcedDisconnectDialog():void
		{
			this.layoutManager.showDialog( CommonDialogNames.ReconnectDialog_NAME, new BasicReconnectDialogProperties( Localize.text( "generic_alert_loggedout_title" ), Localize.text( "generic_alert_loggedout_copy" ), this.onReconnect, Localize.text( "generic_btn_reconnect" ) ) );
		}

		protected showServerDisconnectDialog():void
		{
			this.layoutManager.showDialog( CommonDialogNames.ReconnectDialog_NAME, new BasicReconnectDialogProperties( Localize.text( "generic_alert_connection_lost_title" ), Localize.text( "generic_alert_connection_lost_copy" ), this.onReconnect, Localize.text( "generic_btn_reconnect" ) ) );
		}

		protected onReconnect():void
		{
			if (EnvGlobalsHandler.globals.loginIsKeyBased)
			{
				this.reloadIFrame();
			}
			else
			{
				BasicController.getInstance().onReconnect();
				CommandController.instance.executeCommand( BasicController.COMMAND_INITALIZE_CONTROLLER );
			}
		}

		private reloadIFrame():void
		{
			BasicModel.socialData.reloadIFrame();
		}

		protected get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

