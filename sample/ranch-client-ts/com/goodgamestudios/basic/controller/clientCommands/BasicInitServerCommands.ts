

	import { BasicController } from "../BasicController";
	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { CMTCommand } from "../commands/CMTCommand";
	import { CPSCommand } from "../commands/CPSCommand";
	import { GCHCommand } from "../commands/GCHCommand";
	import { GFLCommand } from "../commands/GFLCommand";
	import { GICCommand } from "../commands/GICCommand";
	import { GPICommand } from "../commands/GPICommand";
	import { LPPCommand } from "../commands/LPPCommand";
	import { NCHCommand } from "../commands/NCHCommand";
	import { NFOCommand } from "../commands/NFOCommand";
	import { SICCommand } from "../commands/SICCommand";
	import { SMSCommand } from "../commands/SMSCommand";
	import { SPECommand } from "../commands/SPECommand";
	import { SPLCommand } from "../commands/SPLCommand";
	import { TCICommand } from "../commands/TCICommand";
	import { VPMCommand } from "../commands/VPMCommand";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	

	export class BasicInitServerCommands extends SimpleCommand
	{
		protected commandDict:Map<any, any> = BasicController.commandDict;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var commandDict:Map<any, any> = BasicController.commandDict;
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

