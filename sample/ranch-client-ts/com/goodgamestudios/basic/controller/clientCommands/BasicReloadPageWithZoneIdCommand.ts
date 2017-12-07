/**
 * Created by svyterna on 27.1.2015.
 */


	import { BasicModel } from "../../model/BasicModel";
	import { error } from "../../../logging/error";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	import ExternalInterface = createjs.ExternalInterface;

	export class BasicReloadPageWithZoneIdCommand extends BasicClientCommand
	{
		/*override*/ public /*final*/ execute( commandVars:Object = null ):void
		{
			var selectedInstance:InstanceVO = (<InstanceVO>commandVars );

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

