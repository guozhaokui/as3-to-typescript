

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { CommonGameStates } from "../../constants/CommonGameStates";
	import { BasicController } from "../BasicController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { LogChannels } from "../../../logging/channels/concrete/LogChannels";
	import { FirstInstanceTrackingEvent } from "../../../tracking/FirstInstanceTrackingEvent";
	import { TrackingCache } from "../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../tracking/constants/TrackingEventIds";

	import getTimer = createjs.getTimer;

	/**
	 * Triggered when:
	 * - User is new (there was no account cookie before)
	 * - Didn't came from landing page
	 * - User logged in
	 */
	export class BasicUsertunnelStateCommand extends SimpleCommand
	{
		public static INVALID_TRACKING:string = "INVALID_TRACKING";

		protected nonLinearTrackingFeatureUsed:boolean = true;
		private gameState:string;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			this.gameState = (<String>commandVars );

			// Sanity check
			if (!TrackingCache.getInstance().isInitialized)
			{
				return;
			}

			// Sanity check: Don't track in local sandbox
			if (this.env.isLocal)
			{
				LogChannels.tracking.debug( "Local BasicUsertunnelStateCommand, TRACK: " + this.gameState );
				return;
			}

			// Execute tunnel tracking if
			// - This is a first time visit
			// - The campaign/marketing variables are valid and in campaign data is written into cookie
			if (this.env.doUserTunnelTracking)
			{
				var websiteId:string;
				// If an invalid game state has been detected the current session cannot be a first visit
				// -> Send an INVALID_TRACKING game state and stop the tunnel tracking afterwards
				if (this.gameState == BasicUsertunnelStateCommand.INVALID_TRACKING)
				{
					// TODO: Unregister the whole BasicUsertunnelStateCommand
					this.env.isFirstVisitOfGGS = false;
				}

				// Check if the game is sending GAME_JOINED event - FLC-2332
				if (this.gameState == CommonGameStates.GAME_JOINED)
				{
					// Start to count the time for playtime events
					BasicController.getInstance().startFirstInstancePlaytimeTracking();
				}

				var trackingEvent:FirstInstanceTrackingEvent = (<FirstInstanceTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.FIRST_INSTANCE ) );
				trackingEvent.gameState = this.gameState;
				// Map Boolean env.isRegistered to 0/1
				trackingEvent.registered = Number( this.env.isRegistered );

				// is first instance tracking valid?
				if (this.gameState == BasicUsertunnelStateCommand.INVALID_TRACKING)
				{
					// IS NO first time user -> delete first instance tracking
					trackingEvent.isFirstInstanceUser = false;
				}
				else
				{
					// IS first time user -> keep tracking
					trackingEvent.isFirstInstanceUser = true;
				}

				trackingEvent.sessionLength = this.env.sessionLength.toFixed();
				trackingEvent.sessionLengthMs = (getTimer() - this.env.sessionStartTime).toString();
				trackingEvent.tutorialLength = "0";
				trackingEvent.accountID = this.env.accountId;

				// Session id
				trackingEvent.sessionId = this.env.sessionId;

				// Build version of the specific game
				trackingEvent.version = parseInt( this.env.buildNumberGame );

				// "clp": Indicator if the client has been embedded in landingpage, map Boolean to 0/1
				trackingEvent.clp = Number( this.env.isLandingpageClient );

				// Set campaign vars
				trackingEvent.cv = this.env.campainVars;

				// AB test data. Currently depending on landingpage AB tests.
				trackingEvent.testID = this.env.accountCookie.testId;
				trackingEvent.caseID = this.env.accountCookie.caseId;

				// GGS Partner websiteId
				websiteId = this.env.urlVariables.websiteId;
				// Take "0" as default
				websiteId = (websiteId == "") ? "0" : websiteId;
				trackingEvent.websiteId = websiteId;

				this.nonLinearTrackingFeatureUsed ? trackingEvent.previousGameState = this.env.previousFirstInstanceGamestate : trackingEvent.previousGameState = "";

				LogChannels.tracking.debug( "TRACK: " + this.gameState + " - firstVisit: " + this.env.isFirstVisitOfGGS + ", campaign valid: " + this.env.campainVars.isValid() + ", clp: " + trackingEvent.clp + ", version: " + trackingEvent.version + ", registered: " + trackingEvent.registered );

				var eventWasSent:boolean = TrackingCache.getInstance().sendEvent( TrackingEventIds.FIRST_INSTANCE );

				if (eventWasSent && this.nonLinearTrackingFeatureUsed)
				{
					this.env.previousFirstInstanceGamestate = this.gameState;
				}
			}
		}

		private get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
