

	import { BasicController } from "../BasicController";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { fatal } from "../../../logging/fatal";
	import { info } from "../../../logging/info";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class BasicConnectClientCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var instanceVO:InstanceVO = BasicModel.instanceProxy.selectedInstanceVO;

			if (!instanceVO)
			{
				fatal( "instanceVO is null!" );
				return;
			}

			if (BasicModel.smartfoxClient.isConnected)
			{
				BasicModel.smartfoxClient.logout();
			}

			info( "Connect to: " + instanceVO.toString() );

			BasicController.getInstance().connectClient( instanceVO.ip, instanceVO.port );
		}
	}
