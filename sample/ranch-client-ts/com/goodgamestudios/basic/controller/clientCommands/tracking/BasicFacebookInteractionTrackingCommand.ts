

	import { BasicTrackingCommand } from "./basis/BasicTrackingCommand";
	import { FacebookInteractionTrackingcommandVO } from "./vo/FacebookInteractionTrackingcommandVO";
	import { BasicModel } from "../../../model/BasicModel";
	import { debug } from "../../../../logging/debug";
	import { warn } from "../../../../logging/warn";
	import { FacebookInteractionTrackingEvent } from "../../../../tracking/FacebookInteractionTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	export class BasicFacebookInteractionTrackingCommand extends BasicTrackingCommand
	{
		/*override*/ public execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:FacebookInteractionTrackingEvent =
					(<FacebookInteractionTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.FACEBOOK_INTERACTION ) );

			event.playerId = BasicModel.userData.playerID;

			var vo:FacebookInteractionTrackingcommandVO = (<FacebookInteractionTrackingcommandVO>objectVars )
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

