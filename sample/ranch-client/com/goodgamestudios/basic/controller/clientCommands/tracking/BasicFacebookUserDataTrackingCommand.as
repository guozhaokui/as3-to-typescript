package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.FacebookUserDataTrackingCommandVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.warn;
	import com.goodgamestudios.tracking.FacebookUserDataTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicFacebookUserDataTrackingCommand extends BasicTrackingCommand
	{
		override public function execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:FacebookUserDataTrackingEvent =
					TrackingCache.getInstance().getEvent( TrackingEventIds.FACEBOOK_USER_DATA ) as FacebookUserDataTrackingEvent;

			var vo:FacebookUserDataTrackingCommandVO = objectVars as FacebookUserDataTrackingCommandVO;
			event.playerId = BasicModel.userData.playerID;
			event.timestamp = new Date().getTime() / 1000;
			event.facebookId = vo.facebookId;
			event.isAccountVerified = vo.isAccountVerified;
			event.fullName = vo.fullName;
			event.firstName = vo.firstName;
			event.lastName = vo.lastName;

			event.profileLink = vo.profileLink;
			event.gender = vo.gender;
			event.locale = vo.locale;
			event.ageRange = vo.ageRange;
			event.utcOffset = vo.utcOffset;
			event.birthday = vo.birthday;
			event.email = vo.email;
			event.facebookBusinessToken = vo.facebookBusinessToken;

			debug(
					"Track FacebookUserData"
					+ ", name: " + vo.fullName
					+ ", facebookId: " + vo.facebookId
					+ ", isAccountVerified: " + vo.isAccountVerified
			);

			TrackingCache.getInstance().sendEvent( TrackingEventIds.FACEBOOK_USER_DATA );
		}
	}
}
