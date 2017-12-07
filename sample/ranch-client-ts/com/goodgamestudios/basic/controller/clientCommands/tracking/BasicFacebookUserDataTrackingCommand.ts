

	import { BasicTrackingCommand } from "./basis/BasicTrackingCommand";
	import { FacebookUserDataTrackingCommandVO } from "./vo/FacebookUserDataTrackingCommandVO";
	import { BasicModel } from "../../../model/BasicModel";
	import { debug } from "../../../../logging/debug";
	import { warn } from "../../../../logging/warn";
	import { FacebookUserDataTrackingEvent } from "../../../../tracking/FacebookUserDataTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	export class BasicFacebookUserDataTrackingCommand extends BasicTrackingCommand
	{
		/*override*/ public execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:FacebookUserDataTrackingEvent =
					(<FacebookUserDataTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.FACEBOOK_USER_DATA ) );

			var vo:FacebookUserDataTrackingCommandVO = (<FacebookUserDataTrackingCommandVO>objectVars );
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

