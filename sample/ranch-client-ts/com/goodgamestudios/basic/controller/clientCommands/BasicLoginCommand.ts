

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicController } from "../BasicController";
	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicLoginCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			BasicController.getInstance().onLogIn();

			if (EnvGlobalsHandler.globals.pln != "" && EnvGlobalsHandler.globals.sig != "")
			{
				BasicModel.smartfoxClient.sendMessage(
						BasicSmartfoxConstants.C2S_LOGIN_SOCIAL,
						[EnvGlobalsHandler.globals.pln,						// social login name
							EnvGlobalsHandler.globals.sig,						// access key
							BasicModel.smartfoxClient.connectionTime,			// connect time
							BasicModel.smartfoxClient.roundTripTime,			// ping
							EnvGlobalsHandler.globals.referrer,					// referrer
							EnvGlobalsHandler.globals.networkId,				// network id
							EnvGlobalsHandler.globals.accountId,				// account id
							"",													// support key
							"",													// time zone
							EnvGlobalsHandler.globals.urlVariables.loginSource]
				);
			}
			else
			{
				BasicController.getInstance().sendServerMessageAndWait(
						BasicSmartfoxConstants.C2S_LOGIN,
						[BasicModel.userData.loginName,
							BasicModel.userData.loginPwd,
							BasicModel.smartfoxClient.connectionTime,
							BasicModel.smartfoxClient.roundTripTime,
							EnvGlobalsHandler.globals.accountId],
						BasicSmartfoxConstants.C2S_LOGIN
				);
			}
		}
	}

