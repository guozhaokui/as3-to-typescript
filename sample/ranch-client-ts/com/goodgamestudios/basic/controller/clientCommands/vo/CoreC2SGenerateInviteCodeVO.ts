/**
 * Created by tschenkel on 1/6/2015.
 */


	import { BasicSmartfoxConstants } from "../../BasicSmartfoxConstants";
	import { BasicCommandVO } from "../../commands/BasicCommandVO";

	export class CoreC2SGenerateInviteCodeVO extends BasicCommandVO
	{
		// Documentation in https://sites.google.com/a/goodgamestudios.com/tech-wiki/java/gamedocumentation/core/events/generateinvitecodeevent

		public T:string; // Type of the friend invite code

		/*override*/ public getCmdId():string
		{
			return BasicSmartfoxConstants.C2S_GENERATE_INVITE_CODE;
		}

		/**
		 * VO used to generate a invite code for the logged user.
		 * @param type String Specify the type of code that will be generated. Accepted values are 'code' or 'link'
		 */
		constructor( type:string = "code" ){
			this.T = type;
		}
	}

