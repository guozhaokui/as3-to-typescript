

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { GGSCountryController } from "../../../language/countryMapper/GGSCountryController";

	export class BasicRegisterJsonCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var params:any[] = (<Array>commandVars );
			var email:string = params.shift();
			var password:string = params.shift();
			var paramObject:Object = (<Object>params.shift() );

			paramObject.mail = email;
			paramObject.pw = password;
			paramObject.referrer = EnvGlobalsHandler.globals.referrer;
			paramObject.lang = GGSCountryController.instance.currentCountry.ggsLanguageCode;
			paramObject.did = EnvGlobalsHandler.globals.distributorId;
			paramObject.connectTime = BasicModel.smartfoxClient.connectionTime;
			paramObject.ping = BasicModel.smartfoxClient.roundTripTime;
			paramObject.accountId = EnvGlobalsHandler.globals.accountId;
			paramObject.campainPId = EnvGlobalsHandler.globals.campainVars.partnerId;
			paramObject.campainCr = EnvGlobalsHandler.globals.campainVars.creative;
			paramObject.campainPl = EnvGlobalsHandler.globals.campainVars.placement;
			paramObject.campainKey = EnvGlobalsHandler.globals.campainVars.keyword;
			paramObject.campainNW = EnvGlobalsHandler.globals.campainVars.network;
			paramObject.campainLP = EnvGlobalsHandler.globals.campainVars.lp;
			paramObject.campainCId = EnvGlobalsHandler.globals.campainVars.channelId;
			paramObject.campainTS = EnvGlobalsHandler.globals.campainVars.trafficSource;
			paramObject.adid = EnvGlobalsHandler.globals.campainVars.aid;
			paramObject.camp = EnvGlobalsHandler.globals.campainVars.camp;
			paramObject.adgr = EnvGlobalsHandler.globals.campainVars.adgr;
			paramObject.matchtype = EnvGlobalsHandler.globals.campainVars.matchtype;

			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_REGISTER, [JSON.stringify( paramObject )] );
			BasicModel.userData.loginPwd = password;
		}
	}
