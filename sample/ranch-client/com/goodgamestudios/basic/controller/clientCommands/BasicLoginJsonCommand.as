package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;

	public class BasicLoginJsonCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			if (EnvGlobalsHandler.globals.pln != "" && EnvGlobalsHandler.globals.sig != "")
			{
				commandVars.PLN = EnvGlobalsHandler.globals.pln;
				commandVars.KEY = EnvGlobalsHandler.globals.sig;
				commandVars.connectTime = BasicModel.smartfoxClient.connectionTime;
				commandVars.ping = BasicModel.smartfoxClient.roundTripTime;
				commandVars.referrer = EnvGlobalsHandler.globals.referrer;
				commandVars.networkID = EnvGlobalsHandler.globals.networkId;

				BasicModel.smartfoxClient.sendMessage(
						BasicSmartfoxConstants.C2S_LOGIN_SOCIAL,
						[
							JSON.stringify( commandVars )
						]
				);
			}
			else
			{
				commandVars.name = BasicModel.userData.loginName;
				commandVars.pw = BasicModel.userData.loginPwd;
				commandVars.lang = GGSCountryController.instance.currentCountry.ggsLanguageCode;
				commandVars.did = EnvGlobalsHandler.globals.distributorId;
				commandVars.connectTime = BasicModel.smartfoxClient.connectionTime;
				commandVars.ping = BasicModel.smartfoxClient.roundTripTime;
				commandVars.accountId = EnvGlobalsHandler.globals.accountId;

				BasicController.getInstance().sendServerMessageAndWait(
						BasicSmartfoxConstants.C2S_LOGIN,
						[
							JSON.stringify( commandVars )
						],
						BasicSmartfoxConstants.C2S_LOGIN
				);
			}
		}
	}
}