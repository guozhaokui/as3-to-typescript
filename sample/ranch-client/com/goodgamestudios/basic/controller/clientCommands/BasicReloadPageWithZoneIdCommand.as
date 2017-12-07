/**
 * Created by svyterna on 27.1.2015.
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.logging.error;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	import flash.external.ExternalInterface;

	public class BasicReloadPageWithZoneIdCommand extends BasicClientCommand
	{
		override public final function execute( commandVars:Object = null ):void
		{
			var selectedInstance:InstanceVO = commandVars as InstanceVO;

			if (selectedInstance)
			{
				BasicModel.networkCookie.instanceId = selectedInstance.instanceId;
				BasicModel.networkCookie.zoneId = selectedInstance.zoneId + "";

				// reload page
				if (ExternalInterface.available)
				{
					try
					{
						ExternalInterface.call( "function refresh(){location.reload();}" );
					}
					catch (e:Error)
					{
						error( "ExternalInterface call failed." );
					}
				}

			}
		}

	}
}
