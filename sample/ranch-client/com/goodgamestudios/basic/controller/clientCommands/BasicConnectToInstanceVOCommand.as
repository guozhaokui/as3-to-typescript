package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.externalLogging.ExternalLog;
	import com.goodgamestudios.externalLogging.factories.InstanceErrorLOFactory;
	import com.goodgamestudios.logging.fatal;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	public class BasicConnectToInstanceVOCommand extends SimpleCommand
	{
		public static const NAME:String = "BasicConnectToInstanceVOCommand";

		override final public function execute( commandVars:Object = null ):void
		{
			var instanceVO:InstanceVO = commandVars as InstanceVO;

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
}
