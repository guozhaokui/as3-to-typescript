package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.constants.CommonGameStates;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.channels.concrete.LogChannels;
	import com.goodgamestudios.tracking.FirstInstanceTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	import flash.utils.getTimer;

	/**
	 * Triggered when:
	 * - User is new (there was no account cookie before)
	 * - Didn't came from landing page
	 * - User logged in
	 */
	public class BasicUsertunnelStateCommand extends SimpleCommand
	{
		public static const INVALID_TRACKING:String = "INVALID_TRACKING";

		protected var nonLinearTrackingFeatureUsed:Boolean = true;
		private var gameState:String;

		override public function execute( commandVars:Object = null ):void
		{
			gameState = commandVars as String;

			// Sanity check
			if (!TrackingCache.getInstance().isInitialized)
			{
				return;
			}

			// Sanity check: Don't track in local sandbox
			if (env.isLocal)
			{
				LogChannels.tracking.debug( "Local BasicUsertunnelStateCommand, TRACK: " + gameState );
				return;
			}

			// Execute tunnel tracking if
			// - This is a first time visit
			// - The campaign/marketing variables are valid and in campaign data is written into cookie
			if (env.doUserTunnelTracking)
			{
				var websiteId:String;
				// If an invalid game state has been detected the current session cannot be a first visit
				// -> Send an INVALID_TRACKING game state and stop the tunnel tracking afterwards
				if (gameState == INVALID_TRACKING)
				{
					// TODO: Unregister the whole BasicUsertunnelStateCommand
					env.isFirstVisitOfGGS = false;
				}

				// Check if the game is sending GAME_JOINED event - FLC-2332
				if (gameState == CommonGameStates.GAME_JOINED)
				{
					// Start to count the time for playtime events
					BasicController.getInstance().startFirstInstancePlaytimeTracking();
				}

				var trackingEvent:FirstInstanceTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.FIRST_INSTANCE ) as FirstInstanceTrackingEvent;
				trackingEvent.gameState = gameState;
				// Map Boolean env.isRegistered to 0/1
				trackingEvent.registered = int( env.isRegistered );

				// is first instance tracking valid?
				if (gameState == INVALID_TRACKING)
				{
					// IS NO first time user -> delete first instance tracking
					trackingEvent.isFirstInstanceUser = false;
				}
				else
				{
					// IS first time user -> keep tracking
					trackingEvent.isFirstInstanceUser = true;
				}

				trackingEvent.sessionLength = env.sessionLength.toFixed();
				trackingEvent.sessionLengthMs = (getTimer() - env.sessionStartTime).toString();
				trackingEvent.tutorialLength = "0";
				trackingEvent.accountID = env.accountId;

				// Session id
				trackingEvent.sessionId = env.sessionId;

				// Build version of the specific game
				trackingEvent.version = parseInt( env.buildNumberGame );

				// "clp": Indicator if the client has been embedded in landingpage, map Boolean to 0/1
				trackingEvent.clp = int( env.isLandingpageClient );

				// Set campaign vars
				trackingEvent.cv = env.campainVars;

				// AB test data. Currently depending on landingpage AB tests.
				trackingEvent.testID = env.accountCookie.testId;
				trackingEvent.caseID = env.accountCookie.caseId;

				// GGS Partner websiteId
				websiteId = env.urlVariables.websiteId;
				// Take "0" as default
				websiteId = (websiteId == "") ? "0" : websiteId;
				trackingEvent.websiteId = websiteId;

				nonLinearTrackingFeatureUsed ? trackingEvent.previousGameState = env.previousFirstInstanceGamestate : trackingEvent.previousGameState = "";

				LogChannels.tracking.debug( "TRACK: " + gameState + " - firstVisit: " + env.isFirstVisitOfGGS + ", campaign valid: " + env.campainVars.isValid() + ", clp: " + trackingEvent.clp + ", version: " + trackingEvent.version + ", registered: " + trackingEvent.registered );

				var eventWasSent:Boolean = TrackingCache.getInstance().sendEvent( TrackingEventIds.FIRST_INSTANCE );

				if (eventWasSent && nonLinearTrackingFeatureUsed)
				{
					env.previousFirstInstanceGamestate = gameState;
				}
			}
		}

		private function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}