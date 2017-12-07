

	import { BasicSmartfoxConstants } from "../../BasicSmartfoxConstants";
	import { BasicCommandVO } from "../../commands/BasicCommandVO";

	export class CoreC2SSetInviteCodeVO extends BasicCommandVO
	{
		public IC:string;				// Friend invite code
		public RM:string;				// refer_method
		public EID_INVITED:string;		// external_invitee_id   (optional or mandatory depending on referrer )
		public EID_INVITER:string;		// external_inviter_id   (optional or mandatory depending on referrer )

		/*override*/ public getCmdId():string
		{
			return BasicSmartfoxConstants.C2S_SET_INVITE_CODE;
		}

		constructor( inviteCode:string, referrer:string, inviterID:string = null, inviteeID:string = null ){
			this.IC = inviteCode;
			this.RM = referrer;
			this.EID_INVITED = inviteeID;
			this.EID_INVITER = inviterID;
		}
	}

