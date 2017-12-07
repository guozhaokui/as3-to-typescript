package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicInviteFriendJsonCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var params:Array = commandVars as Array;
			if (!params || params.length != 3)
			{
				return;
			}
			var paramObject:Object = { myname: String( params.shift() ), name: String( params.shift() ), mail: String( params.shift() )};
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_INVITE_FRIEND, [ JSON.stringify( paramObject )] );
		}
	}
}