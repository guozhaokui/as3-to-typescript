

	import { BasicController } from "./controller/BasicController";
	import { BasicAwayFromKeyboardController } from "./controller/afkController/BasicAwayFromKeyboardController";
	import { ExtendedAwayFromKeyboardController } from "./controller/afkController/ExtendedAwayFromKeyboardController";
	import { BasicAddExtraCurrencyCommand } from "./controller/clientCommands/BasicAddExtraCurrencyCommand";
import { BasicCDNTestCommand } from "./controller/clientCommands/BasicCDNTestCommand";
import { BasicChangeCountryCommand } from "./controller/clientCommands/BasicChangeCountryCommand";
import { BasicChangeLanguageCommand } from "./controller/clientCommands/BasicChangeLanguageCommand";
import { BasicCheckMaintenanceCommand } from "./controller/clientCommands/BasicCheckMaintenanceCommand";
import { BasicClientCommand } from "./controller/clientCommands/BasicClientCommand";
import { BasicConnectClientCommand } from "./controller/clientCommands/BasicConnectClientCommand";
import { BasicConnectToInstanceVOCommand } from "./controller/clientCommands/BasicConnectToInstanceVOCommand";
import { BasicConnectionFailedCommand } from "./controller/clientCommands/BasicConnectionFailedCommand";
import { BasicConnectionLostCommand } from "./controller/clientCommands/BasicConnectionLostCommand";
import { BasicConnectionTimeoutCommand } from "./controller/clientCommands/BasicConnectionTimeoutCommand";
import { BasicDestroyGameCommand } from "./controller/clientCommands/BasicDestroyGameCommand";
import { BasicExtensionResponseCommand } from "./controller/clientCommands/BasicExtensionResponseCommand";
import { BasicHandleIdentityManagementErrorCommand } from "./controller/clientCommands/BasicHandleIdentityManagementErrorCommand";
import { BasicHandleServerErrorCommand } from "./controller/clientCommands/BasicHandleServerErrorCommand";
import { BasicIdentityManagementCommand } from "./controller/clientCommands/BasicIdentityManagementCommand";
import { BasicInitActiveCountriesCommand } from "./controller/clientCommands/BasicInitActiveCountriesCommand";
import { BasicInitLoggerCommand } from "./controller/clientCommands/BasicInitLoggerCommand";
import { BasicInitServerCommands } from "./controller/clientCommands/BasicInitServerCommands";
import { BasicInitServerListCommand } from "./controller/clientCommands/BasicInitServerListCommand";
import { BasicInitZoneCapacityCommand } from "./controller/clientCommands/BasicInitZoneCapacityCommand";
import { BasicInitalizeControllerCommand } from "./controller/clientCommands/BasicInitalizeControllerCommand";
import { BasicInviteFriendCommand } from "./controller/clientCommands/BasicInviteFriendCommand";
import { BasicInviteFriendJsonCommand } from "./controller/clientCommands/BasicInviteFriendJsonCommand";
import { BasicJoinedRoomCommand } from "./controller/clientCommands/BasicJoinedRoomCommand";
import { BasicLoginCommand } from "./controller/clientCommands/BasicLoginCommand";
import { BasicLoginJsonCommand } from "./controller/clientCommands/BasicLoginJsonCommand";
import { BasicLogoutCommand } from "./controller/clientCommands/BasicLogoutCommand";
import { BasicLostPasswordCommand } from "./controller/clientCommands/BasicLostPasswordCommand";
import { BasicNetworkUpdateCommand } from "./controller/clientCommands/BasicNetworkUpdateCommand";
import { BasicOnClickMoreCurrencyCommand } from "./controller/clientCommands/BasicOnClickMoreCurrencyCommand";
import { BasicOpenForumCommand } from "./controller/clientCommands/BasicOpenForumCommand";
import { BasicPrepareReconnectCommand } from "./controller/clientCommands/BasicPrepareReconnectCommand";
import { BasicReconnectCommand } from "./controller/clientCommands/BasicReconnectCommand";
import { BasicRegisterJsonCommand } from "./controller/clientCommands/BasicRegisterJsonCommand";
import { BasicRegisterUserCommand } from "./controller/clientCommands/BasicRegisterUserCommand";
import { BasicReloadNetworkCommand } from "./controller/clientCommands/BasicReloadNetworkCommand";
import { BasicReloadPageWithZoneIdCommand } from "./controller/clientCommands/BasicReloadPageWithZoneIdCommand";
import { BasicReportSurveyCommand } from "./controller/clientCommands/BasicReportSurveyCommand";
import { BasicRequestSocialLoginKeysCommand } from "./controller/clientCommands/BasicRequestSocialLoginKeysCommand";
import { BasicSendClientLoginTrackingCommand } from "./controller/clientCommands/BasicSendClientLoginTrackingCommand";
import { BasicShowComaTeaserCommand } from "./controller/clientCommands/BasicShowComaTeaserCommand";
import { BasicShowRegisterDialogCommand } from "./controller/clientCommands/BasicShowRegisterDialogCommand";
import { BasicSocialLoginCommand } from "./controller/clientCommands/BasicSocialLoginCommand";
import { BasicTestCaseInfoCommand } from "./controller/clientCommands/BasicTestCaseInfoCommand";
import { BasicTrackRegistrationDataCommand } from "./controller/clientCommands/BasicTrackRegistrationDataCommand";
import { BasicUsertunnelStateCommand } from "./controller/clientCommands/BasicUsertunnelStateCommand";
import { BasicVerifyPlayerMailCommand } from "./controller/clientCommands/BasicVerifyPlayerMailCommand";
import { ChooseLoginMethodCommand } from "./controller/clientCommands/ChooseLoginMethodCommand";
import { SelectInitialInstanceVOCommand } from "./controller/clientCommands/SelectInitialInstanceVOCommand";

	import { CPSCommand } from "./controller/commands/CPSCommand";
	import { ExternalInterfaceController } from "./controller/externalInterface/ExternalInterfaceController";
	import { JavascriptFunctionName } from "./controller/externalInterface/JavascriptFunctionName";
	import { BasicFacebookConnectCommand } from "./fb/connectlogin/BasicFacebookConnectCommand";
	import { BasicModel } from "./model/BasicModel";
	import { BasicBackgroundComponent } from "./view/BasicBackgroundComponent";
	import { CommandController } from "../commanding/CommandController";
	import { GGSCountryController } from "../language/countryMapper/GGSCountryController";
	import { debug } from "../logging/debug";
	import { error } from "../logging/error";
	import { info } from "../logging/info";
	import { BrowserUtil } from "../utils/BrowserUtil";
	import { AnalyticsTracker } from "../../google/analytics/AnalyticsTracker";
	import { GATracker } from "../../google/analytics/GATracker";

	import Sprite = createjs.Sprite;
	import Event = createjs.Event;
	import getTimer = createjs.getTimer;

	import { Signal } from "../../../org/osflash/signals/Signal";

	export class BasicGame extends Sprite
	{
		public static NAME:string = "BasicGame";

		protected preloaderView:BasicBackgroundComponent;
		protected isInitializing:boolean = false;
		protected sessionStart:number;
		protected currentState:string = "not_set";
		protected firstSessionCloseMessage:string = "";

		protected initialized:Signal;

		constructor( preloaderView:BasicBackgroundComponent ){
			this.preloaderView = preloaderView;
			this.addEventListener( Event.ADDED_TO_STAGE, this.onAddedToStage );
		}

		/**
		 * is executed when this game added to stage
		 * initialize gameproperties and tracked Pageview for analytics
		 */
		protected onAddedToStage( e:Event ):void
		{
			this.removeEventListener( Event.ADDED_TO_STAGE, this.onAddedToStage );

			this.initialized = new Signal();
			this.initialized.addOnce( this.onGameInitialized );

			this.callAnalyticsTracking();

			// Call javascript function "ggsOnLoadComplete"
			ExternalInterfaceController.instance.executeJavaScriptFunction( JavascriptFunctionName.ON_LOAD_COMPLETE );

			if (!this.isInitializing)
			{
				this.isInitializing = true;
				this.stage.stageFocusRect = false;
				this.sessionStart = getTimer();
				BrowserUtil.addLanguageCallback( this.getLanguageCallback );

				this.registerCommands();
				this.initializeGame();
			}

			// Set right one AFK-controller.
			if (this.env.sendUserActivityStatusToTheServer)
			{
				debug( "The game uses the extended version of the AFK-controller." );
				BasicController.getInstance().awayFromKeyboardController = new ExtendedAwayFromKeyboardController( this.stage );
			}
			else
			{
				debug( "The game uses the basic version of the AFK-controller." );
				BasicController.getInstance().awayFromKeyboardController = new BasicAwayFromKeyboardController( this.stage );
			}

			// save frame one size to cookie
			BasicModel.localData.saveFirstFrameSize( this.env.frameOneSizeInKB );
		}

		private onGameInitialized():void
		{
			info( "Game initialization complete." )

			// Connect to server
			this.establishServerConnection();
		}

		private establishServerConnection():void
		{
			// Select instance for initial server connection
			CommandController.instance.executeCommand( BasicController.SELECT_INITIAL_INSTANCEVO );

			// Connect to preselected instance
			CommandController.instance.executeCommand( BasicController.COMMAND_CONNECT_TO_INSTANCEVO, BasicModel.instanceProxy.selectedInstanceVO );
		}

		protected registerCommands():void
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

		private callAnalyticsTracking():void
		{
			// google analytics tracking
			try
			{
				var tracker:AnalyticsTracker = new GATracker( this, "UA-9219771-1", "AS3", false );
				tracker.trackPageview( this.env.analyticsTrackingPath );
			}
			catch (e:Error)
			{
				error( "Error while calling analytics tracking!" );
			}
		}

		private getLanguageCallback():string
		{
			return GGSCountryController.instance.currentCountry.ggsLanguageCode;
		}

		protected initializeGame():void
		{
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
