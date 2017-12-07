package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.basic.view.CommonDialogNames;
	import com.goodgamestudios.basic.view.dialogs.BasicReconnectDialogProperties;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.core.localization.utils.Localize;

	public class BasicPrepareReconnectCommand extends SimpleCommand
	{

		override public function execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_DESTROY_GAME );
			layoutManager.state = BasicLayoutManager.STATE_CONNECT;
			layoutManager.showDialog(
				CommonDialogNames.ReconnectDialog_NAME,
				new BasicReconnectDialogProperties(
					Localize.text( "generic_alert_information" ),
					Localize.text( "generic_alert_connection_lost_copy" ),
					onReconnect,
					Localize.text( "generic_btn_reconnect" )
				)
			);
		}

		protected function onReconnect():void
		{
			if (EnvGlobalsHandler.globals.loginIsKeyBased)
			{
				reloadIFrame();
			}
			else
			{
				layoutManager.onStartProgressbar();
				BasicController.getInstance().onReconnect();
			}

		}

		private function reloadIFrame():void
		{
			BasicModel.socialData.reloadIFrame();
		}

		private function get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}
	}
}
