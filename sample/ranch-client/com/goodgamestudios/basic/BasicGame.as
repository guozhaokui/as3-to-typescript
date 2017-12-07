package com.goodgamestudios.basic
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.afkController.BasicAwayFromKeyboardController;
	import com.goodgamestudios.basic.controller.afkController.ExtendedAwayFromKeyboardController;
	import com.goodgamestudios.basic.controller.clientCommands.*;
	import com.goodgamestudios.basic.controller.commands.CPSCommand;
	import com.goodgamestudios.basic.controller.externalInterface.ExternalInterfaceController;
	import com.goodgamestudios.basic.controller.externalInterface.JavascriptFunctionName;
	import com.goodgamestudios.basic.fb.connectlogin.BasicFacebookConnectCommand;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicBackgroundComponent;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.error;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.utils.BrowserUtil;
	import com.google.analytics.AnalyticsTracker;
	import com.google.analytics.GATracker;

	import flash.display.Sprite;
	import flash.events.Event;
	import flash.utils.getTimer;

	import org.osflash.signals.Signal;

	public class BasicGame extends Sprite
	{
		public static const NAME:String = "BasicGame";

		protected var preloaderView:BasicBackgroundComponent;
		protected var isInitializing:Boolean = false;
		protected var sessionStart:Number;
		protected var currentState:String = "not_set";
		protected var firstSessionCloseMessage:String = "";

		protected var initialized:Signal;

		public function BasicGame( preloaderView:BasicBackgroundComponent )
		{
			this.preloaderView = preloaderView;
			this.addEventListener( Event.ADDED_TO_STAGE, onAddedToStage );
		}

		/**
		 * is executed when this game added to stage
		 * initialize gameproperties and tracked Pageview for analytics
		 */
		protected function onAddedToStage( e:Event ):void
		{
			this.removeEventListener( Event.ADDED_TO_STAGE, onAddedToStage );

			initialized = new Signal();
			initialized.addOnce( onGameInitialized );

			callAnalyticsTracking();

			// Call javascript function "ggsOnLoadComplete"
			ExternalInterfaceController.instance.executeJavaScriptFunction( JavascriptFunctionName.ON_LOAD_COMPLETE );

			if (!isInitializing)
			{
				isInitializing = true;
				stage.stageFocusRect = false;
				sessionStart = getTimer();
				BrowserUtil.addLanguageCallback( getLanguageCallback );

				registerCommands();
				initializeGame();
			}

			// Set right one AFK-controller.
			if (env.sendUserActivityStatusToTheServer)
			{
				debug( "The game uses the extended version of the AFK-controller." );
				BasicController.getInstance().awayFromKeyboardController = new ExtendedAwayFromKeyboardController( stage );
			}
			else
			{
				debug( "The game uses the basic version of the AFK-controller." );
				BasicController.getInstance().awayFromKeyboardController = new BasicAwayFromKeyboardController( stage );
			}

			// save frame one size to cookie
			BasicModel.localData.saveFirstFrameSize( env.frameOneSizeInKB );
		}

		private function onGameInitialized():void
		{
			info( "Game initialization complete." )

			// Connect to server
			establishServerConnection();
		}

		private function establishServerConnection():void
		{
			// Select instance for initial server connection
			CommandController.instance.executeCommand( BasicController.SELECT_INITIAL_INSTANCEVO );

			// Connect to preselected instance
			CommandController.instance.executeCommand( BasicController.COMMAND_CONNECT_TO_INSTANCEVO, BasicModel.instanceProxy.selectedInstanceVO );
		}

		protected function registerCommands():void
		{
			CommandController.instance.registerCommand( BasicController.COMMAND_EXTENSION_RESPONSE, BasicExtensionResponseCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_INIT_SERVERCOMMANDS, BasicInitServerCommands );
			CommandController.instance.registerCommand( BasicController.COMMAND_SOCIAL_LOGIN, BasicSocialLoginCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_LOGIN, BasicLoginCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_LOGOUT, BasicLogoutCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CONNECTION_LOST, BasicConnectionLostCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_INITALIZE_CONTROLLER, BasicInitalizeControllerCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_RECONNECT, BasicReconnectCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_OPEN_FORUM, BasicOpenForumCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_DESTROY_GAME, BasicDestroyGameCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_SHOW_REGISTER_DIALOG, BasicShowRegisterDialogCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_SHOW_COMA_TEASER, BasicShowComaTeaserCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_JOINED_ROOM, BasicJoinedRoomCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CONNECTION_FAILED, BasicConnectionFailedCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CONNECTION_TIMEOUT, BasicConnectionTimeoutCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_PREPARE_RECONNECT, BasicPrepareReconnectCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_ADD_EXTRA_CURRENCY, BasicAddExtraCurrencyCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_ON_CLICK_MORE_CURRENY, BasicOnClickMoreCurrencyCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_LOGIN_JSON, BasicLoginJsonCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_REGISTER_USER_JSON, BasicRegisterJsonCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_INVITE_FRIEND, BasicInviteFriendCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_INVITE_FRIEND_JSON, BasicInviteFriendJsonCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CHANGE_COUNTRY, BasicChangeCountryCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CHECK_MAINTENANCE, BasicCheckMaintenanceCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CONNECT_TO_INSTANCEVO, BasicConnectToInstanceVOCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CONNECT_CLIENT, BasicConnectClientCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_FACEBOOK_CONNECT_LOGIN, BasicFacebookConnectCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_CHILD_PROTECTION_SHUTDOWN_ALERT, CPSCommand );
			CommandController.instance.registerCommand( BasicController.COMMAND_RELOAD_PAGE_WITH_ZONE_ID, BasicReloadPageWithZoneIdCommand );
			// Splitrun test case info
			CommandController.instance.registerCommand( BasicController.COMMAND_TEST_CASE_INFO, BasicTestCaseInfoCommand );
		}

		private function callAnalyticsTracking():void
		{
			// google analytics tracking
			try
			{
				var tracker:AnalyticsTracker = new GATracker( this, "UA-9219771-1", "AS3", false );
				tracker.trackPageview( env.analyticsTrackingPath );
			}
			catch (e:Error)
			{
				error( "Error while calling analytics tracking!" );
			}
		}

		private function getLanguageCallback():String
		{
			return GGSCountryController.instance.currentCountry.ggsLanguageCode;
		}

		protected function initializeGame():void
		{
		}

		protected function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}