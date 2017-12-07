

	export class InvitationTrackingCommandVO
	{

		/**
		 * Measurement point (see  InvitationConst )
		 */
		public action:string;

		/**
		 * mandatory
		 */
		public inviterPlayerId:number;

		/**
		 * mandatory
		 */
		public inviterGameId:number;

		/**
		 * mandatory
		 */
		public inviterNetworkId:number;

		/**
		 * Server instance of the receiver/invitee
		 * mandatory
		 */
		public inviterInstanceId:number;


		/**
		 * optional (depending on Action)
		 */
		public inviteePlayerId:number;

		/**
		 * optional (depending on Action)
		 */
		public inviteeGameId:number;

		/**
		 * optional (depending on Action)
		 */
		public inviteeNetworkId:number;

		/**
		 * Server instance of the receiver/invitee
		 * optional (depending on Action)
		 */
		public inviteeInstanceId:number;
		/**
		 * 3d party  Id of the receiver/invitee    (ie FacebookId)
		 * optional (depending on Action)
		 */
		public inviteeExternalId:string;

		/**
		 * 3d party  Id of the sender/inviter    (ie FacebookId)
		 * optional (depending on Action)
		 */
		public inviterExternalId:string;

		/**
		 *   Information on the respective method that was used for referals (Facebook, email, clipboard, ...)
		 *   optional
		 */
		public referMethod:string;

		/**
		 * information about what prompt caused the invitation to be sent (e.g. in-game quest, private offer...)
		 * optional
		 */
		public trigger:string;

	}

