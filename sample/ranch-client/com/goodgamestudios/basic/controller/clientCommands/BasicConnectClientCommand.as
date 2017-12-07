package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.fatal;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	public class BasicConnectClientCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
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
}