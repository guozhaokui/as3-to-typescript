

	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicInviteFriendCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var params:any[] = (<Array>commandVars );

			if (!params || params.length != 3)
			{
				return;
			}
			var myname:string = String( params.shift() );
			var name:string = String( params.shift() );
			var mail:string = String( params.shift() );
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_INVITE_FRIEND, [myname, name, mail] );
		}
	}

