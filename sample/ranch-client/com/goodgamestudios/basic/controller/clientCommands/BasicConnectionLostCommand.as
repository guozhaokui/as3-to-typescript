package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.basic.view.CommonDialogNames;
	import com.goodgamestudios.basic.view.dialogs.BasicReconnectDialogProperties;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.core.localization.utils.Localize;

	public class BasicConnectionLostCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_DESTROY_GAME );
			layoutManager.state = BasicLayoutManager.STATE_CONNECT;

			if (BasicModel.smartfoxClient.userForcedDisconnect)
			{
				if (env.underAgeConnectionLost && env.isIdentityManagementActive)
				{
					CommandController.instance.executeCommand( BasicController.COMMAND_DESTROY_GAME );
					layoutManager.state = BasicLayoutManager.STATE_CONNECT;
					layoutManager.showDialog( CommonDialogNames.ReconnectDialog_NAME, new BasicReconnectDialogProperties( Localize.text( "generic_alert_information" ), Localize.text( "generic_alert_korea_logoutMessage" ), onReconnect, Localize.text( "generic_btn_reconnect" ) ) );
				}
				else
				{
					showForcedDisconnectDialog();
				}

			}
			else
			{
				showServerDisconnectDialog();
			}
		}

		protected function showForcedDisconnectDialog():void
		{
			layoutManager.showDialog( CommonDialogNames.ReconnectDialog_NAME, new BasicReconnectDialogProperties( Localize.text( "generic_alert_loggedout_title" ), Localize.text( "generic_alert_loggedout_copy" ), onReconnect, Localize.text( "generic_btn_reconnect" ) ) );
		}

		protected function showServerDisconnectDialog():void
		{
			layoutManager.showDialog( CommonDialogNames.ReconnectDialog_NAME, new BasicReconnectDialogProperties( Localize.text( "generic_alert_connection_lost_title" ), Localize.text( "generic_alert_connection_lost_copy" ), onReconnect, Localize.text( "generic_btn_reconnect" ) ) );
		}

		protected function onReconnect():void
		{
			if (EnvGlobalsHandler.globals.loginIsKeyBased)
			{
				reloadIFrame();
			}
			else
			{
				BasicController.getInstance().onReconnect();
				CommandController.instance.executeCommand( BasicController.COMMAND_INITALIZE_CONTROLLER );
			}
		}

		private function reloadIFrame():void
		{
			BasicModel.socialData.reloadIFrame();
		}

		protected function get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}

		protected function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}
