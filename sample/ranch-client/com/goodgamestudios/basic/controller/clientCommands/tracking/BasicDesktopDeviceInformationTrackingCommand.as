/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 03.03.14
 * Time: 18:10
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicFirstSessionTrackingCommand;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.logging.error;
	import com.goodgamestudios.tracking.DesktopDeviceInformationTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	import flash.external.ExternalInterface;
	import flash.system.Capabilities;

	public class BasicDesktopDeviceInformationTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		private static const SEMICOLON:String = ";";
		private static const COMMA:String = ",";

		override public function execute( commandVars:Object = null ):void
		{
			var trackingEvent:DesktopDeviceInformationTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.DESKTOP_DEVICE_INFORMATION ) as DesktopDeviceInformationTrackingEvent;

			trackingEvent.playerId = BasicModel.userData.playerID;
			trackingEvent.accountId = EnvGlobalsHandler.globals.accountId.toString();
			trackingEvent.screenResolutionX = Capabilities.screenResolutionX;
			trackingEvent.screenResolutionY = Capabilities.screenResolutionY;
			trackingEvent.flashVersion = Capabilities.version;
			trackingEvent.desktopOs = Capabilities.os;

			// determine browser information
			if (ExternalInterface.available)
			{
				try
				{
					var browserString:String = ExternalInterface.call( "window.navigator.userAgent.toString" );
					trackingEvent.browserString = browserString ? filterBrowserString( browserString ) : "";
				}
				catch (e:SecurityError)
				{
					error( "ExternalInterface unavailable " + e.getStackTrace() );
				}
			}

			TrackingCache.getInstance().sendEvent( TrackingEventIds.DESKTOP_DEVICE_INFORMATION );
		}

		/**
		 * To prevent the problem of additional semicolons in the var_data,
		 * we need to replace ";" with "," symbol.
		 */
		private function filterBrowserString( originalString:String ):String
		{
			return originalString.split( SEMICOLON ).join( COMMA );

		}
	}
}
