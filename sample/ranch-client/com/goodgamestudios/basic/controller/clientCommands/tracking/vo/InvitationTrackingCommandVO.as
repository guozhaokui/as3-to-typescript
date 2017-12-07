package com.goodgamestudios.basic.controller.clientCommands.tracking.vo
{

	public class InvitationTrackingCommandVO
	{

		/**
		 * Measurement point (see  InvitationConst )
		 */
		public var action:String;

		/**
		 * mandatory
		 */
		public var inviterPlayerId:int;

		/**
		 * mandatory
		 */
		public var inviterGameId:int;

		/**
		 * mandatory
		 */
		public var inviterNetworkId:int;

		/**
		 * Server instance of the receiver/invitee
		 * mandatory
		 */
		public var inviterInstanceId:int;


		/**
		 * optional (depending on Action)
		 */
		public var inviteePlayerId:int;

		/**
		 * optional (depending on Action)
		 */
		public var inviteeGameId:int;

		/**
		 * optional (depending on Action)
		 */
		public var inviteeNetworkId:int;

		/**
		 * Server instance of the receiver/invitee
		 * optional (depending on Action)
		 */
		public var inviteeInstanceId:int;
		/**
		 * 3d party  Id of the receiver/invitee    (ie FacebookId)
		 * optional (depending on Action)
		 */
		public var inviteeExternalId:String;

		/**
		 * 3d party  Id of the sender/inviter    (ie FacebookId)
		 * optional (depending on Action)
		 */
		public var inviterExternalId:String;

		/**
		 *   Information on the respective method that was used for referals (Facebook, email, clipboard, ...)
		 *   optional
		 */
		public var referMethod:String;

		/**
		 * information about what prompt caused the invitation to be sent (e.g. in-game quest, private offer...)
		 * optional
		 */
		public var trigger:String;

	}
}
