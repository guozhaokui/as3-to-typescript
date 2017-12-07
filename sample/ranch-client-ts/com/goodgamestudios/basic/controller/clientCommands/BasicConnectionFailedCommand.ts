

	import { BasicController } from "../BasicController";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicConnectionFailedCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			CommandController.instance.executeCommand( BasicController.COMMAND_PREPARE_RECONNECT );
		}
	}

