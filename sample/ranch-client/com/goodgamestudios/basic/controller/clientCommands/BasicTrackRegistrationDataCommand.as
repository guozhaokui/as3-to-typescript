/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 25.06.13
 * Time: 15:53
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.constants.IdentityManagementConstants;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.tracking.ConnectionTrackingUtil;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.tracking.FirstInstanceTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicTrackRegistrationDataCommand extends SimpleCommand
	{
		protected var wasExecuted:Boolean = false;

		override public function execute( commandVars:Object = null ):void
		{
			if (wasExecuted)
			{
				return;
			}

			//----
			var trackingEvent:FirstInstanceTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.FIRST_INSTANCE ) as FirstInstanceTrackingEvent;
			env.isRegistered = true;
			trackingEvent.registered = 1;
			trackingEvent.playerId = BasicModel.userData.playerID;
			//----

			if (env.doUserTunnelTracking)
			{
				// Executes delayed round trip on SmartfoxClient after about 60s (will be tracked automatically afterwards)
				ConnectionTrackingUtil.instance.measureRTT( ConnectionTrackingUtil.SECOND_CONNECTION_EVENT_DELAY );
				ConnectionTrackingUtil.instance.measureRTT( ConnectionTrackingUtil.THIRD_CONNECTION_EVENT_DELAY );
//				BasicModel.smartfoxClient.performPolicyPingTest();
			}

			if (env.isIdentityManagementActive)
			{
				CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_SIREN_INTERACTION, IdentityManagementConstants.TRACKING_SIREN24_SUCCESSFUL_ID_CHECK );
			}

			CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_DESKTOP_DEVICE_INFORMATION_EVENT );

			wasExecuted = true;
		}

		protected function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}
