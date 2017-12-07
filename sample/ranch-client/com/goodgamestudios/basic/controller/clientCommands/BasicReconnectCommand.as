package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.components.BasicDialogHandler;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicReconnectCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			BasicDialogHandler.getInstance().destroy();
			BasicController.getInstance().paymentHash = null;
		}
	}
}
