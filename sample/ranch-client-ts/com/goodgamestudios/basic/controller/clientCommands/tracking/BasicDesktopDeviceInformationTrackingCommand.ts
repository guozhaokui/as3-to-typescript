/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 03.03.14
 * Time: 18:10
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { BasicFirstSessionTrackingCommand } from "./basis/BasicFirstSessionTrackingCommand";
	import { BasicModel } from "../../../model/BasicModel";
	import { error } from "../../../../logging/error";
	import { DesktopDeviceInformationTrackingEvent } from "../../../../tracking/DesktopDeviceInformationTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	import ExternalInterface = createjs.ExternalInterface;
	import Capabilities = createjs.Capabilities;

	export class BasicDesktopDeviceInformationTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		private static SEMICOLON:string = ";";
		private static COMMA:string = ",";

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var trackingEvent:DesktopDeviceInformationTrackingEvent = (<DesktopDeviceInformationTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.DESKTOP_DEVICE_INFORMATION ) );

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
					var browserString:string = ExternalInterface.call( "window.navigator.userAgent.toString" );
					trackingEvent.browserString = browserString ? this.filterBrowserString( browserString ) : "";
				}
				catch (e:SecurityError)
				{
					error( "ExternalInterface unavailable " + this.e.getStackTrace() );
				}
			}

			TrackingCache.getInstance().sendEvent( TrackingEventIds.DESKTOP_DEVICE_INFORMATION );
		}

		/**
		 * To prevent the problem of additional semicolons in the var_data,
		 * we need to replace ";" with "," symbol.
		 */
		private filterBrowserString( originalString:string ):string
		{
			return originalString.split( BasicDesktopDeviceInformationTrackingCommand.SEMICOLON ).join( BasicDesktopDeviceInformationTrackingCommand.COMMA );

		}
	}

