

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicController } from "../BasicController";
	import { ExternalInterfaceController } from "../externalInterface/ExternalInterfaceController";
	import { JavascriptFunctionName } from "../externalInterface/JavascriptFunctionName";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { PerformanceMonitoringService } from "../../../profiling/service/PerformanceMonitoringService";

	export class BasicLogoutCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			// As soon as the user logs out don't treat him as first time user, stop the first instance tracking
			EnvGlobalsHandler.globals.isFirstVisitOfGGS = false;

			//check if accountCookie exists
			if (EnvGlobalsHandler.globals.accountCookie)
			{
				EnvGlobalsHandler.globals.accountCookie.clearCampaignData();
			}

			BasicController.getInstance().onLogOut();
			BasicModel.sessionData.resetLoggedinTimer();
			BasicModel.smartfoxClient.logout();
			BasicLayoutManager.getInstance().revertFullscreen();

			// Call javascript function "ggsOnLogout"
			ExternalInterfaceController.instance.executeJavaScriptFunction( JavascriptFunctionName.ON_LOGOUT );

			// If this was a social session: refresh the social login keys
			if (EnvGlobalsHandler.globals.isSSO)
			{
				// Refresh login keys
				CommandController.instance.executeCommand( BasicController.REQUEST_SOCIAL_LOGIN_KEYS );

				// Delete username/password to prevent an auto login to a possibly wrong instance after the logout and a page reload.
				BasicModel.localData.deleteLoginData();
			}
			PerformanceMonitoringService.getInstance().stopMonitoring();
		}
	}
