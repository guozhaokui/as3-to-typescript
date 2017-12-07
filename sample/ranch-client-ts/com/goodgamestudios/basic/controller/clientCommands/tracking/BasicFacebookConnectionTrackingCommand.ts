

	import { BasicTrackingCommand } from "./basis/BasicTrackingCommand";
	import { FacebookConnectionTrackingCommandVO } from "./vo/FacebookConnectionTrackingCommandVO";
	import { FacebookConnect } from "../../../fb/apitest/FacebookConnect";
	import { BasicModel } from "../../../model/BasicModel";
	import { debug } from "../../../../logging/debug";
	import { warn } from "../../../../logging/warn";
	import { FacebookConnectionTrackingEvent } from "../../../../tracking/FacebookConnectionTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	export class BasicFacebookConnectionTrackingCommand extends BasicTrackingCommand
	{
		/*override*/ public execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:FacebookConnectionTrackingEvent =
				(<FacebookConnectionTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.FACEBOOK_CONNECTION ) );

			var vo:FacebookConnectionTrackingCommandVO = (<FacebookConnectionTrackingCommandVO>objectVars )
			event.playerId = BasicModel.userData.playerID;
			event.zoneId = BasicModel.instanceProxy.selectedInstanceVO.zoneId;
			event.timestamp = new Date().getTime() / 1000;

			event.facebookExternalState = vo.facebookConnectionState;
			event.facebookId = vo.facebookId;
			event.gameLevel = vo.gameLevel;

			debug(
				"Track FacebookConnection"
				+ ", facebookConnectionState: " + vo.facebookConnectionState
				+ ", facebookId: " + vo.facebookId
				+ ", gameLevel: " + vo.gameLevel
			);

			TrackingCache.getInstance().sendEvent( TrackingEventIds.FACEBOOK_CONNECTION );
		}
	}

