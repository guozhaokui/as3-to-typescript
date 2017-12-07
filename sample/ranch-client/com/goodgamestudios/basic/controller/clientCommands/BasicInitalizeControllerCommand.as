package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.BasicSoundController;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicInitalizeControllerCommand extends SimpleCommand
	{
		override public final function execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_INIT_SERVERCOMMANDS );

			initializeGameControllers();
		}

		/**
		 * Use this hook to initialize game specific controller logic
		 */
		protected function initializeGameControllers():void
		{
			// override
		}

		public final function initSoundController( soundController:BasicSoundController ):void
		{
			BasicController.getInstance().soundController = soundController;
			BasicController.getInstance().soundController.initialize();
		}
	}
}