

	import { BasicController } from "../BasicController";
	import { BasicCommand } from "../commands/BasicCommand";
	import { SmartfoxEvent } from "../../event/SmartfoxEvent";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { warn } from "../../../logging/warn";
	import { DictionaryUtil } from "../../../utils/DictionaryUtil";

	export class BasicExtensionResponseCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var event:SmartfoxEvent = (<SmartfoxEvent>commandVars );
			var error:number = Number( event.params[ 0 ] );

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

