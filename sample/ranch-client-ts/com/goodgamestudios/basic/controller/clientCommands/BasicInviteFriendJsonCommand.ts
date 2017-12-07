

	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicInviteFriendJsonCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var params:any[] = (<Array>commandVars );
			if (!params || params.length != 3)
			{
				return;
			}
			var paramObject:Object = { myname: String( params.shift() ), name: String( params.shift() ), mail: String( params.shift() )};
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_INVITE_FRIEND, [JSON.stringify( paramObject )] );
		}
	}
