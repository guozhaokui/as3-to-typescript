/**
 * Created by rkamysz on 5/26/2015.
 */
package com.goodgamestudios.basic.controller.clientCommands.google
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.tracking.google.GTMService;
	import com.goodgamestudios.tracking.google.vos.GTMPingVO;

	public class GGSTrackEventCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
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
}
