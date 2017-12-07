/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:46
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicFirstSessionTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.PackageDownloadCommandVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.tracking.PackageDownloadEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	/**
	 * Special command, which fires the PackageDownloadEvent.
	 * This command is used to measure the download duration of the:
	 * > Cachebreaker.
	 * > CDN/DNS test file.
	 */
	public class BasicPackageDownloadTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			if (!commandIsAllowed)
			{
				return;
			}

			var eventInfoObject:PackageDownloadCommandVO = commandVars as PackageDownloadCommandVO;

			var packageDownloadTrackingEvent:PackageDownloadEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.PACKAGE_DOWNLOAD ) as PackageDownloadEvent;
			packageDownloadTrackingEvent.downloadDuration = eventInfoObject.downloadDuration;
			packageDownloadTrackingEvent.downloadSize = eventInfoObject.downloadSize;
			packageDownloadTrackingEvent.downloadURL = eventInfoObject.downloadURL;
			packageDownloadTrackingEvent.countryCode = GGSCountryController.instance.currentCountry.ggsCountryCode;
			packageDownloadTrackingEvent.gameSwfLoadingTime = env.gameSwfLoadingTime;

			// TODO: Niko, this is a good topic to discuss: AccountId is tracked with every event as "accountId". Is it necessary to track this parameter as var_3 extra?
			packageDownloadTrackingEvent.accountID = env.accountId;

			// Only if user is registered.
			if (BasicModel.userData)
			{
				packageDownloadTrackingEvent.playerID = BasicModel.userData.playerID;
			}

			TrackingCache.getInstance().sendEvent( TrackingEventIds.PACKAGE_DOWNLOAD );
		}
	}
}
