package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.commands.BasicCommand;
	import com.goodgamestudios.basic.event.SmartfoxEvent;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.warn;
	import com.goodgamestudios.utils.DictionaryUtil;

	public class BasicExtensionResponseCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var event:SmartfoxEvent = commandVars as SmartfoxEvent;
			var error:int = int( event.params[ 0 ] );

			if (DictionaryUtil.containsKey( BasicController.commandDict, event.cmdId ))
			{
				var command:BasicCommand = BasicController.commandDict[ event.cmdId ];
				command.executeCommand( error, event.params );
				BasicController.getInstance().serverMessageArrived( event.cmdId );
			}
			else
			{
				warn( "UNKNOWN SERVER COMMAND: " + event.cmdId );
			}
		}
	}
}
