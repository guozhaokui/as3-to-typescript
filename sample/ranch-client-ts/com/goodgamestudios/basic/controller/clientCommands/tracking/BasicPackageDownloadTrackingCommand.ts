/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:46
 * To change this template use File | Settings | File Templates.
 */


	import { BasicFirstSessionTrackingCommand } from "./basis/BasicFirstSessionTrackingCommand";
	import { PackageDownloadCommandVO } from "./vo/PackageDownloadCommandVO";
	import { BasicModel } from "../../../model/BasicModel";
	import { GGSCountryController } from "../../../../language/countryMapper/GGSCountryController";
	import { PackageDownloadEvent } from "../../../../tracking/PackageDownloadEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	/**
	 * Special command, which fires the PackageDownloadEvent.
	 * This command is used to measure the download duration of the:
	 * > Cachebreaker.
	 * > CDN/DNS test file.
	 */
	export class BasicPackageDownloadTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (!this.commandIsAllowed)
			{
				return;
			}

			var eventInfoObject:PackageDownloadCommandVO = (<PackageDownloadCommandVO>commandVars );

			var packageDownloadTrackingEvent:PackageDownloadEvent = (<PackageDownloadEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.PACKAGE_DOWNLOAD ) );
			packageDownloadTrackingEvent.downloadDuration = eventInfoObject.downloadDuration;
			packageDownloadTrackingEvent.downloadSize = eventInfoObject.downloadSize;
			packageDownloadTrackingEvent.downloadURL = eventInfoObject.downloadURL;
			packageDownloadTrackingEvent.countryCode = GGSCountryController.instance.currentCountry.ggsCountryCode;
			packageDownloadTrackingEvent.gameSwfLoadingTime = this.env.gameSwfLoadingTime;

			// TODO: Niko, this is a good topic to discuss: AccountId is tracked with every event as "accountId". Is it necessary to track this parameter as var_3 extra?
			packageDownloadTrackingEvent.accountID = this.env.accountId;

			// Only if user is registered.
			if (BasicModel.userData)
			{
				packageDownloadTrackingEvent.playerID = BasicModel.userData.playerID;
			}

			TrackingCache.getInstance().sendEvent( TrackingEventIds.PACKAGE_DOWNLOAD );
		}
	}

