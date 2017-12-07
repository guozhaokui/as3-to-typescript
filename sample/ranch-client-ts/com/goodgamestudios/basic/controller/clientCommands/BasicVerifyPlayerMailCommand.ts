

	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicVerifyPlayerMailCommand extends SimpleCommand
	{
		private ALL_OK:number = 0;
		private GENERAL_ERROR:number = 1;
		private FEATURE_NOT_AVAILABLE:number = 2;
		private EMAIL_ALREADY_VERIFIED:number = 3;
		private EMAIL_ALREADY_IN_USE:number = 4;
		private EMAIL_BLOCKED:number = 5;
		private EMAIL_INVALID:number = 6;
		private EMAIL_TOO_LONG:number = 7;
		private EMAIL_DOMAIN_BLOCKED:number = 8;
		protected errorCode:number;

		constructor( singleExecution:boolean = false ){
			super( singleExecution );
		}

		/*override*/ public execute( commandVars:Object = null ):void
		{
			this.errorCode = (<Number>commandVars );

			switch (this.errorCode)
			{
				case this.ALL_OK:
					this.all_ok();
					break;
				case this.GENERAL_ERROR:
					this.general_error();
					break;
				case this.FEATURE_NOT_AVAILABLE:
					this.feature_not_available();
					break;
				case this.EMAIL_ALREADY_VERIFIED:
					this.email_already_verified();
					break;
				case this.EMAIL_ALREADY_IN_USE:
					this.email_already_in_use();
					break;
				case this.EMAIL_BLOCKED:
					this.email_blocked();
					break;
				case this.EMAIL_INVALID:
					this.email_invalid();
					break;
				case this.EMAIL_TOO_LONG:
					this.email_too_long();
					break;
				case this.EMAIL_DOMAIN_BLOCKED:
					this.email_domain_blocked();
					break;
				default:
					this.general_error();
					break;
			}
		}

		protected all_ok():void
		{
		}

		protected general_error():void
		{
		}

		protected feature_not_available():void
		{
		}

		protected email_already_verified():void
		{
		}

		protected email_already_in_use():void
		{
		}

		protected email_blocked():void
		{
		}

		protected email_invalid():void
		{
		}

		protected email_too_long():void
		{
		}

		protected email_domain_blocked():void
		{
		}

		public static sendMessage( mail:string ):void
		{
			var paramObject:Object = {MAIL: mail};
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_VERIFY_PLAYER_MAIL_EVENT, [JSON.stringify( paramObject )] );
		}
	}
