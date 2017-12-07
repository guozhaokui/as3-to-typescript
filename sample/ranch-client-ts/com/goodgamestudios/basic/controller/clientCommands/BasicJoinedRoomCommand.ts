

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { CommonGameStates } from "../../constants/CommonGameStates";
	import { BasicController } from "../BasicController";
	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { SmartfoxEvent } from "../../event/SmartfoxEvent";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicSmartfoxClient } from "../../model/components/BasicSmartfoxClient";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { fatal } from "../../../logging/fatal";

	export class BasicJoinedRoomCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var event:SmartfoxEvent = (<SmartfoxEvent>commandVars );

			if (event.params[ 0 ] == BasicSmartfoxClient.LOBBY_ROOM_NAME)
			{
				CommandController.instance.executeCommand( BasicController.COMMAND_USERTUNNEL_STATE, CommonGameStates.VERSION_CHECK_SEND );

				BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_VERSION_CHECK, [EnvGlobalsHandler.globals.buildNumberGame,'','',EnvGlobalsHandler.globals.sessionId] );
			}
			else
			{
				fatal( "Joined room name != " + BasicSmartfoxClient.LOBBY_ROOM_NAME + " : " + event.params[ 0 ] );
			}
		}
	}

