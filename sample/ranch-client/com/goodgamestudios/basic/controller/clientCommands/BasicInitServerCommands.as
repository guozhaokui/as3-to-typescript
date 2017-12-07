package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.controller.commands.CMTCommand;
	import com.goodgamestudios.basic.controller.commands.CPSCommand;
	import com.goodgamestudios.basic.controller.commands.GCHCommand;
	import com.goodgamestudios.basic.controller.commands.GFLCommand;
	import com.goodgamestudios.basic.controller.commands.GICCommand;
	import com.goodgamestudios.basic.controller.commands.GPICommand;
	import com.goodgamestudios.basic.controller.commands.LPPCommand;
	import com.goodgamestudios.basic.controller.commands.NCHCommand;
	import com.goodgamestudios.basic.controller.commands.NFOCommand;
	import com.goodgamestudios.basic.controller.commands.SICCommand;
	import com.goodgamestudios.basic.controller.commands.SMSCommand;
	import com.goodgamestudios.basic.controller.commands.SPECommand;
	import com.goodgamestudios.basic.controller.commands.SPLCommand;
	import com.goodgamestudios.basic.controller.commands.TCICommand;
	import com.goodgamestudios.basic.controller.commands.VPMCommand;
	import com.goodgamestudios.commanding.SimpleCommand;

	import flash.utils.Dictionary;

	public class BasicInitServerCommands extends SimpleCommand
	{
		protected var commandDict:Dictionary = BasicController.commandDict;

		override public function execute( commandVars:Object = null ):void
		{
			var commandDict:Dictionary = BasicController.commandDict;
			commandDict[ BasicSmartfoxConstants.S2C_CASH_HASH ] = new GCHCommand();
			commandDict[ BasicSmartfoxConstants.S2C_NEW_CASH_HASH ] = new NCHCommand();
			commandDict[ BasicSmartfoxConstants.S2C_GET_FORUM_LOGIN_DATA ] = new GFLCommand();
			commandDict[ BasicSmartfoxConstants.S2C_SERVER_MESSAGE ] = new SMSCommand();
			commandDict[ BasicSmartfoxConstants.S2C_COMA_TEASER ] = new CMTCommand();
			commandDict[ BasicSmartfoxConstants.S2C_SERVER_INFO_EVENT ] = new NFOCommand();
			commandDict[ BasicSmartfoxConstants.S2C_VERIFY_PLAYER_MAIL_EVENT ] = new VPMCommand();
			commandDict[ BasicSmartfoxConstants.S2C_LOST_PASSWORD_EVENT ] = new LPPCommand();
			commandDict[ BasicSmartfoxConstants.S2C_CHILD_PROTECTION_AUTO_SHUTDOWN_EVENT ] = new CPSCommand();
			commandDict[ BasicSmartfoxConstants.S2C_SOCIAL_PLAYER_EXISTS ] = new SPECommand();
			commandDict[ BasicSmartfoxConstants.S2C_NEW_LOGIN_SOCIAL ] = new SPLCommand();
			commandDict[ BasicSmartfoxConstants.S2C_TEST_CASE_INFO ] = new TCICommand();
			commandDict[ BasicSmartfoxConstants.S2C_GET_PLAYER_INFO ] = new GPICommand();
			commandDict[ BasicSmartfoxConstants.S2C_GENERATE_INVITE_CODE ] = new GICCommand();
			commandDict[ BasicSmartfoxConstants.S2C_SET_INVITE_CODE ] = new SICCommand();
		}
	}
}
