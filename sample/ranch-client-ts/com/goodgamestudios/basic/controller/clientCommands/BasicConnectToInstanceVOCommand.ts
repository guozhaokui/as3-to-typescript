

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicController } from "../BasicController";
	import { BasicModel } from "../../model/BasicModel";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { ExternalLog } from "../../../externalLogging/ExternalLog";
	import { InstanceErrorLOFactory } from "../../../externalLogging/factories/InstanceErrorLOFactory";
	import { fatal } from "../../../logging/fatal";
	import { info } from "../../../logging/info";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class BasicConnectToInstanceVOCommand extends SimpleCommand
	{
		public static NAME:string = "BasicConnectToInstanceVOCommand";

		/*override*/ /*final*/ public execute( commandVars:Object = null ):void
		{
			var instanceVO:InstanceVO = (<InstanceVO>commandVars );

			if (instanceVO)
			{
				BasicModel.instanceProxy.selectedInstanceVO = instanceVO;

				if (BasicModel.localData)
				{
					// Don't save the instance in SharedObject for support key sessions
					if (EnvGlobalsHandler.globals.suk == "")
					{
						BasicModel.localData.saveInstanceId( instanceVO.instanceId );
					}
				}

				info( "Connect to instance: " + instanceVO );

				// If no maintenance execute BasicController.COMMAND_CONNECT_CLIENT
				CommandController.instance.executeCommand( BasicController.COMMAND_CHECK_MAINTENANCE, BasicController.COMMAND_CONNECT_CLIENT );
			}
			else
			{
				fatal( "Selected InstanceVO is null. Cannot connect to a server!" );

				// Send external error
				ExternalLog.logger.log( new InstanceErrorLOFactory( InstanceErrorLOFactory.CONNECT_TO_INSTANCE_NULL ) );
			}
		}
	}

