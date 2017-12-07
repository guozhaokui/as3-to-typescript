package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;

	public class BasicRegisterJsonCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var params:Array = commandVars as Array;
			var email:String = params.shift();
			var password:String = params.shift();
			var paramObject:Object = params.shift() as Object;

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

			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_REGISTER, [ JSON.stringify( paramObject )] );
			BasicModel.userData.loginPwd = password;
		}
	}
}