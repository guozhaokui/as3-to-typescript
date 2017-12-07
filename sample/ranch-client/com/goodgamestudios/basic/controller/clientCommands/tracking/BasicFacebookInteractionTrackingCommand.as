package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.FacebookInteractionTrackingcommandVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.warn;
	import com.goodgamestudios.tracking.FacebookInteractionTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicFacebookInteractionTrackingCommand extends BasicTrackingCommand
	{
		override public function execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:FacebookInteractionTrackingEvent =
					TrackingCache.getInstance().getEvent( TrackingEventIds.FACEBOOK_INTERACTION ) as FacebookInteractionTrackingEvent;

			event.playerId = BasicModel.userData.playerID;

			var vo:FacebookInteractionTrackingcommandVO = objectVars as FacebookInteractionTrackingcommandVO
			event.senderPlayerId = vo.senderPlayerId;
			event.senderInstanceId = vo.senderInstanceId;
			event.senderNetworkId = vo.senderNetworkId;
			event.senderGameId = vo.senderGameId;
			event.senderZoneId = vo.senderZoneId;
			event.senderFacebookId = vo.senderFacebookId;
			event.senderLevel = vo.senderLevel;

			event.receiverPlayerId = vo.receiverPlayerId;
			event.receiverInstanceId = vo.receiverInstanceId;
			event.receiverNetworkId = vo.receiverNetworkId;
			event.receiverGameId = vo.receiverGameId;
			event.receiverZoneId = vo.receiverZoneId;
			event.receiverFacebookId = vo.receiverFacebookId;

			event.stateId = vo.state;
			event.openGraphObjectId = vo.openGraphObjectId;
			event.openGraphActionType = vo.openGraphActionType;

			debug(
					"Track FacebookInteraction"
					+ ", interactionState: " + vo.state
					+ ", senderFacebookId: " + vo.senderFacebookId
					+ ", receiverFacebookId: " + vo.receiverFacebookId
					+ ", gameLevel: " + vo.senderLevel
			);

			TrackingCache.getInstance().sendEvent( TrackingEventIds.FACEBOOK_INTERACTION );
		}
	}
}
