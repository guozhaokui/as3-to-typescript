/**
 * Created by tschenkel on 1/6/2015.
 */
package com.goodgamestudios.basic.controller.clientCommands.vo
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.controller.commands.BasicCommandVO;

	public class CoreC2SGenerateInviteCodeVO extends BasicCommandVO
	{
		// Documentation in https://sites.google.com/a/goodgamestudios.com/tech-wiki/java/gamedocumentation/core/events/generateinvitecodeevent

		public var T:String; // Type of the friend invite code

		override public function getCmdId():String
		{
			return BasicSmartfoxConstants.C2S_GENERATE_INVITE_CODE;
		}

		/**
		 * VO used to generate a invite code for the logged user.
		 * @param type String Specify the type of code that will be generated. Accepted values are 'code' or 'link'
		 */
		public function CoreC2SGenerateInviteCodeVO( type:String = "code" )
		{
			this.T = type;
		}
	}
}
