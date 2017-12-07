/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 25.06.13
 * Time: 15:53
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { IdentityManagementConstants } from "../../constants/IdentityManagementConstants";
	import { BasicController } from "../BasicController";
	import { BasicModel } from "../../model/BasicModel";
	import { ConnectionTrackingUtil } from "../../tracking/ConnectionTrackingUtil";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { FirstInstanceTrackingEvent } from "../../../tracking/FirstInstanceTrackingEvent";
	import { TrackingCache } from "../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../tracking/constants/TrackingEventIds";

	export class BasicTrackRegistrationDataCommand extends SimpleCommand
	{
		protected wasExecuted:boolean = false;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (this.wasExecuted)
			{
				return;
			}

			//----
			var trackingEvent:FirstInstanceTrackingEvent = (<FirstInstanceTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.FIRST_INSTANCE ) );
			this.env.isRegistered = true;
			trackingEvent.registered = 1;
			trackingEvent.playerId = BasicModel.userData.playerID;
			//----

			if (this.env.doUserTunnelTracking)
			{
				// Executes delayed round trip on SmartfoxClient after about 60s (will be tracked automatically afterwards)
				ConnectionTrackingUtil.instance.measureRTT( ConnectionTrackingUtil.SECOND_CONNECTION_EVENT_DELAY );
				ConnectionTrackingUtil.instance.measureRTT( ConnectionTrackingUtil.THIRD_CONNECTION_EVENT_DELAY );
//				BasicModel.smartfoxClient.performPolicyPingTest();
			}

			if (this.env.isIdentityManagementActive)
			{
				CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKING_SIREN24_SUCCESSFUL_ID_CHECK );
			}

			CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_DESKTOP_DEVICE_INFORMATION_EVENT );

			this.wasExecuted = true;
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

