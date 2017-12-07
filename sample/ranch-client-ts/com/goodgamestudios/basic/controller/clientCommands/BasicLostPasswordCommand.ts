

	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicLostPasswordCommand extends SimpleCommand
	{
		private ALL_OK:number = 0;
		private GENERAL_ERROR:number = 1;
		private PLAYER_NOT_FOUND:number = 2;
		private errorCode:number;

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
				case this.PLAYER_NOT_FOUND:
					this.player_not_found();
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

		protected player_not_found():void
		{
		}

		public static sendMessage( mail:string ):void
		{
			var paramObject:Object = {MAIL: mail};
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_LOST_PASSWORD_EVENT, [JSON.stringify( paramObject )] );
		}
	}
