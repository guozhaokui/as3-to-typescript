/**
 * Created by rkamysz on 5/26/2015.
 */


	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { BasicModel } from "../../../model/BasicModel";
	import { SimpleCommand } from "../../../../commanding/SimpleCommand";
	import { GTMService } from "../../../../tracking/google/GTMService";
	import { GTMPingVO } from "../../../../tracking/google/vos/GTMPingVO";

	export class GGSTrackEventCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (typeof(commandVars) == "string")
			{
				var vo:GTMPingVO = new GTMPingVO(
						BasicModel.userData.playerID,
						BasicModel.instanceProxy.selectedInstanceVO.instanceId,
						EnvGlobalsHandler.globals.networkId,
						EnvGlobalsHandler.globals.gameId
				);

				GTMService.instance.callGGSTrackEvent( String( commandVars ), vo );
			}
			else
			{
				throw new Error( "[GGSTrackEventCommand] commandVars must be a string for eventName" );
			}
		}
	}

