package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicLostPasswordCommand extends SimpleCommand
	{
		private var ALL_OK:int = 0;
		private var GENERAL_ERROR:int = 1;
		private var PLAYER_NOT_FOUND:int = 2;
		private var errorCode:int;

		public function BasicLostPasswordCommand( singleExecution:Boolean = false )
		{
			super( singleExecution );
		}

		override public function execute( commandVars:Object = null ):void
		{
			errorCode = commandVars as int;

			switch (errorCode)
			{
				case ALL_OK:
					all_ok();
					break;
				case GENERAL_ERROR:
					general_error();
					break;
				case PLAYER_NOT_FOUND:
					player_not_found();
					break;
				default:
					general_error();
					break;
			}
		}

		protected function all_ok():void
		{
		}

		protected function general_error():void
		{
		}

		protected function player_not_found():void
		{
		}

		public static function sendMessage( mail:String ):void
		{
			var paramObject:Object = {MAIL: mail};
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_LOST_PASSWORD_EVENT, [ JSON.stringify( paramObject )] );
		}
	}
}