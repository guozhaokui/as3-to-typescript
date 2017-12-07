

	export class FacebookInteractionTrackingcommandVO
	{

		/**
		 * mandatory
		 */
		public senderPlayerId:number;

		/**
		 * mandatory
		 */
		public senderInstanceId:number;

		/**
		 * mandatory
		 */
		public senderNetworkId:number;

		/**
		 * mandatory
		 */
		public senderGameId:number;

		/**
		 * zoneId of the sender
		 * mandatory
		 */
		public senderZoneId:number;

		/**
		 * FacebookId  of the sender
		 * mandatory field
		 */
		public senderFacebookId:string;

		/**
		 * level of the sender
		 * mandatory
		 */
		public senderLevel:number;

		/**
		 * Shows state of the request   @see    FacebookRequestStatesConst
		 * mandatory field
		 */
		public state:number;

		/**
		 * Open Graph object that is sent/requested/received etc.
		 */
		public openGraphObjectId:string;

		/**
		 * The Open Graph action that is used with the object (send/receive/request etc)
		 */
		public openGraphActionType:string;

		/**
		 * optional (depending on type of interaction)
		 */
		public receiverPlayerId:number;

		/**
		 * Server instance of the receiver
		 * optional (depending on type of interaction)
		 */
		public receiverInstanceId:number;

		/**
		 * optional (depending on type of interaction)
		 */
		public receiverNetworkId:number;

		/**
		 * optional (depending on type of interaction)
		 */
		public receiverGameId:number;

		/**
		 * optional
		 */
		public receiverZoneId:number;

		/**
		 * FacebookId of the receiver
		 * mandatory field
		 */
		public receiverFacebookId:string;

		/**
		 * level of the receiver
		 * mandatory
		 */
		public receiverLevel:number;
	}
