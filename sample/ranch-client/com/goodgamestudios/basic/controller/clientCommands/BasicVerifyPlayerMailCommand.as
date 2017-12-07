package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicVerifyPlayerMailCommand extends SimpleCommand
	{
		private const ALL_OK:int = 0;
		private const GENERAL_ERROR:int = 1;
		private const FEATURE_NOT_AVAILABLE:int = 2;
		private const EMAIL_ALREADY_VERIFIED:int = 3;
		private const EMAIL_ALREADY_IN_USE:int = 4;
		private const EMAIL_BLOCKED:int = 5;
		private const EMAIL_INVALID:int = 6;
		private const EMAIL_TOO_LONG:int = 7;
		private const EMAIL_DOMAIN_BLOCKED:int = 8;
		protected var errorCode:int;

		public function BasicVerifyPlayerMailCommand( singleExecution:Boolean = false )
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
				case FEATURE_NOT_AVAILABLE:
					feature_not_available();
					break;
				case EMAIL_ALREADY_VERIFIED:
					email_already_verified();
					break;
				case EMAIL_ALREADY_IN_USE:
					email_already_in_use();
					break;
				case EMAIL_BLOCKED:
					email_blocked();
					break;
				case EMAIL_INVALID:
					email_invalid();
					break;
				case EMAIL_TOO_LONG:
					email_too_long();
					break;
				case EMAIL_DOMAIN_BLOCKED:
					email_domain_blocked();
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

		protected function feature_not_available():void
		{
		}

		protected function email_already_verified():void
		{
		}

		protected function email_already_in_use():void
		{
		}

		protected function email_blocked():void
		{
		}

		protected function email_invalid():void
		{
		}

		protected function email_too_long():void
		{
		}

		protected function email_domain_blocked():void
		{
		}

		public static function sendMessage( mail:String ):void
		{
			var paramObject:Object = {MAIL: mail};
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_VERIFY_PLAYER_MAIL_EVENT, [ JSON.stringify( paramObject )] );
		}
	}
}