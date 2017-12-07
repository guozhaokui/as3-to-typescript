package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicLoginCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			BasicController.getInstance().onLogIn();

			if (EnvGlobalsHandler.globals.pln != "" && EnvGlobalsHandler.globals.sig != "")
			{
				BasicModel.smartfoxClient.sendMessage(
						BasicSmartfoxConstants.C2S_LOGIN_SOCIAL,
						[
							EnvGlobalsHandler.globals.pln,						// social login name
							EnvGlobalsHandler.globals.sig,						// access key
							BasicModel.smartfoxClient.connectionTime,			// connect time
							BasicModel.smartfoxClient.roundTripTime,			// ping
							EnvGlobalsHandler.globals.referrer,					// referrer
							EnvGlobalsHandler.globals.networkId,				// network id
							EnvGlobalsHandler.globals.accountId,				// account id
							"",													// support key
							"",													// time zone
							EnvGlobalsHandler.globals.urlVariables.loginSource	// login source
						]
				);
			}
			else
			{
				BasicController.getInstance().sendServerMessageAndWait(
						BasicSmartfoxConstants.C2S_LOGIN,
						[
							BasicModel.userData.loginName,
							BasicModel.userData.loginPwd,
							BasicModel.smartfoxClient.connectionTime,
							BasicModel.smartfoxClient.roundTripTime,
							EnvGlobalsHandler.globals.accountId
						],
						BasicSmartfoxConstants.C2S_LOGIN
				);
			}
		}
	}
}
