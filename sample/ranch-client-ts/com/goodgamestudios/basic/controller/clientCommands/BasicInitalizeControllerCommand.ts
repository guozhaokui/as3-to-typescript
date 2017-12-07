

	import { BasicController } from "../BasicController";
	import { BasicSoundController } from "../BasicSoundController";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicInitalizeControllerCommand extends SimpleCommand
	{
		/*override*/ public /*final*/ execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_INIT_SERVERCOMMANDS );

			this.initializeGameControllers();
		}

		/**
		 * Use this hook to initialize game specific controller logic
		 */
		protected initializeGameControllers():void
		{
			// override
		}

		public /*final*/ initSoundController( soundController:BasicSoundController ):void
		{
			BasicController.getInstance().soundController = soundController;
			BasicController.getInstance().soundController.initialize();
		}
	}
