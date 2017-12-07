package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.FacebookConnectionTrackingCommandVO;
	import com.goodgamestudios.basic.fb.apitest.FacebookConnect;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.warn;
	import com.goodgamestudios.tracking.FacebookConnectionTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicFacebookConnectionTrackingCommand extends BasicTrackingCommand
	{
		override public function execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:FacebookConnectionTrackingEvent =
				TrackingCache.getInstance().getEvent( TrackingEventIds.FACEBOOK_CONNECTION ) as FacebookConnectionTrackingEvent;

			var vo:FacebookConnectionTrackingCommandVO = objectVars as FacebookConnectionTrackingCommandVO
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
}
