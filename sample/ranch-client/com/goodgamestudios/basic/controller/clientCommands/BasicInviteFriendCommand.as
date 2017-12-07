package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicInviteFriendCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var params:Array = commandVars as Array;

			if (!params || params.length != 3)
			{
				return;
			}
			var myname:String = String( params.shift() );
			var name:String = String( params.shift() );
			var mail:String = String( params.shift() );
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_INVITE_FRIEND, [ myname, name, mail ] );
		}
	}
}
