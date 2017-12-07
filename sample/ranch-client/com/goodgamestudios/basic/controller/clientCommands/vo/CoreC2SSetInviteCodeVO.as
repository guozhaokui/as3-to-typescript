package com.goodgamestudios.basic.controller.clientCommands.vo
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.controller.commands.BasicCommandVO;

	public class CoreC2SSetInviteCodeVO extends BasicCommandVO
	{
		public var IC:String;				// Friend invite code
		public var RM:String;				// refer_method
		public var EID_INVITED:String;		// external_invitee_id   (optional or mandatory depending on referrer )
		public var EID_INVITER:String;		// external_inviter_id   (optional or mandatory depending on referrer )

		override public function getCmdId():String
		{
			return BasicSmartfoxConstants.C2S_SET_INVITE_CODE;
		}

		public function CoreC2SSetInviteCodeVO( inviteCode:String, referrer:String, inviterID:String = null, inviteeID:String = null )
		{
			this.IC = inviteCode;
			this.RM = referrer;
			this.EID_INVITED = inviteeID;
			this.EID_INVITER = inviterID;
		}
	}
}
