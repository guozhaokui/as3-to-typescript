package com.goodgamestudios.basic.controller.clientCommands.tracking.vo
{

	public class FacebookInteractionTrackingcommandVO
	{

		/**
		 * mandatory
		 */
		public var senderPlayerId:int;

		/**
		 * mandatory
		 */
		public var senderInstanceId:int;

		/**
		 * mandatory
		 */
		public var senderNetworkId:int;

		/**
		 * mandatory
		 */
		public var senderGameId:int;

		/**
		 * zoneId of the sender
		 * mandatory
		 */
		public var senderZoneId:int;

		/**
		 * FacebookId  of the sender
		 * mandatory field
		 */
		public var senderFacebookId:String;

		/**
		 * level of the sender
		 * mandatory
		 */
		public var senderLevel:int;

		/**
		 * Shows state of the request   @see    FacebookRequestStatesConst
		 * mandatory field
		 */
		public var state:int;

		/**
		 * Open Graph object that is sent/requested/received etc.
		 */
		public var openGraphObjectId:String;

		/**
		 * The Open Graph action that is used with the object (send/receive/request etc)
		 */
		public var openGraphActionType:String;

		/**
		 * optional (depending on type of interaction)
		 */
		public var receiverPlayerId:int;

		/**
		 * Server instance of the receiver
		 * optional (depending on type of interaction)
		 */
		public var receiverInstanceId:int;

		/**
		 * optional (depending on type of interaction)
		 */
		public var receiverNetworkId:int;

		/**
		 * optional (depending on type of interaction)
		 */
		public var receiverGameId:int;

		/**
		 * optional
		 */
		public var receiverZoneId:int;

		/**
		 * FacebookId of the receiver
		 * mandatory field
		 */
		public var receiverFacebookId:String;

		/**
		 * level of the receiver
		 * mandatory
		 */
		public var receiverLevel:int;
	}
}