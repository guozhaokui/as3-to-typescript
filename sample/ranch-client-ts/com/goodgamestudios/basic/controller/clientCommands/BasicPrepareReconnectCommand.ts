

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicController } from "../BasicController";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommonDialogNames } from "../../view/CommonDialogNames";
	import { BasicReconnectDialogProperties } from "../../view/dialogs/BasicReconnectDialogProperties";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { Localize } from "../../../core/localization/utils/Localize";

	export class BasicPrepareReconnectCommand extends SimpleCommand
	{

		/*override*/ public execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_DESTROY_GAME );
			this.layoutManager.state = BasicLayoutManager.STATE_CONNECT;
			this.layoutManager.showDialog(
				CommonDialogNames.ReconnectDialog_NAME,
				new BasicReconnectDialogProperties(
					Localize.text( "generic_alert_information" ),
					Localize.text( "generic_alert_connection_lost_copy" ),
					this.onReconnect,
					Localize.text( "generic_btn_reconnect" )
				)
			);
		}

		protected onReconnect():void
		{
			if (EnvGlobalsHandler.globals.loginIsKeyBased)
			{
				this.reloadIFrame();
			}
			else
			{
				this.layoutManager.onStartProgressbar();
				BasicController.getInstance().onReconnect();
			}

		}

		private reloadIFrame():void
		{
			BasicModel.socialData.reloadIFrame();
		}

		private get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}
	}

