package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.constants.CommonGameStates;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.event.SmartfoxEvent;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.model.components.BasicSmartfoxClient;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.fatal;

	public class BasicJoinedRoomCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var event:SmartfoxEvent = commandVars as SmartfoxEvent;

			if (event.params[ 0 ] == BasicSmartfoxClient.LOBBY_ROOM_NAME)
			{
				CommandController.instance.executeCommand( BasicController.COMMAND_USERTUNNEL_STATE, CommonGameStates.VERSION_CHECK_SEND );

				BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_VERSION_CHECK, [ EnvGlobalsHandler.globals.buildNumberGame,'','',EnvGlobalsHandler.globals.sessionId  ] );
			}
			else
			{
				fatal( "Joined room name != " + BasicSmartfoxClient.LOBBY_ROOM_NAME + " : " + event.params[ 0 ] );
			}
		}
	}
}
