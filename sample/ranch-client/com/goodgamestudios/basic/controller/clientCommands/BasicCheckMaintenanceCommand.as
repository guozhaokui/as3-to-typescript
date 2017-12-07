package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.constants.CommonGameStates;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.environment.providers.PathProvider;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.startup.ForcedMaintenanceEnum;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.externalLogging.ExternalLog;
	import com.goodgamestudios.externalLogging.factories.IOErrorLOFactory;
	import com.goodgamestudios.externalLogging.factories.SecurityErrorLOFactory;
	import com.goodgamestudios.logging.fatal;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.TimerEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.utils.Timer;
	import flash.utils.getTimer;

	public class BasicCheckMaintenanceCommand extends SimpleCommand
	{
		private const MAINTENANCE_TIMER_DELAY_IN_MS:int = 30000;
		private var noMaintenanceCommandName:String;
		private var maintenanceTimer:Timer;

		protected var maintenanceTimeInSeconds:Number;
		private var maintData:Object;

		private const GGS_UTC_LOAD_TRIGGER_OFFSET_IN_SECONDS:int = 300;
		private const UTC_REQUEST_URL:String = "http://time.goodgamestudios.com";
		private var _utcStartTime:Number;
		private var _timeAtStart:Number;
		private var utcTimer:Timer;
		private var ggsUTCLoaded:Boolean = false;

		override public function execute( commandVars:Object = null ):void
		{
			if (commandVars == null)
			{
				noMaintenanceCommandName = null;
			}
			else
			{
				noMaintenanceCommandName = commandVars as String;
			}
			executeDefaultBehavior();
		}

		/**
		 * override this function if your project does not have any maintenance functionality
		 * use executeNoMaintenance in your overwritten method
		 *
		 **/
		protected function executeDefaultBehavior():void
		{
			generateClientUTC();
			loadMaintenanceFile();
		}

		/**
		 * disposeMaintenanceReloadTimer
		 * initialize URLLoader
		 *
		 **/
		private function loadMaintenanceFile():void
		{
			disposeMaintenanceReloadTimer();
			var request:URLRequest = new URLRequest( PathProvider.instance.maintenanceConfigURL );
			var loader:URLLoader = new URLLoader( request );
			loader.addEventListener( Event.COMPLETE, onMaintenanceFileComplete );
			loader.addEventListener( IOErrorEvent.IO_ERROR, onMaintenanceFileIOError );
			loader.addEventListener( SecurityErrorEvent.SECURITY_ERROR, onMaintenanceFileSecurityError );
			loader.load( request );
		}

		/**
		 * decode data
		 *
		 * @param event:Event
		 **/
		private function onMaintenanceFileComplete( event:Event ):void
		{
			removeMaintenaceFileEventListener( event.target as URLLoader );
			//a json Object
			maintData = JSON.parse( event.target.data );
			checkMaintenance();
		}

		/**
		 * generate utc from Date object
		 **/
		private function generateClientUTC():void
		{
			var dateStamp:Date = new Date();
			var unixTimeMilliseconds:Number = Date.UTC( dateStamp.getUTCFullYear(), dateStamp.getUTCMonth(), dateStamp.getUTCDate(), dateStamp.getUTCHours(), dateStamp.getUTCMinutes(), dateStamp.getUTCSeconds(), dateStamp.getUTCMilliseconds() ).valueOf();
			_utcStartTime = Math.round( unixTimeMilliseconds / 1000 );
			_timeAtStart = getTimer();
		}

		/**
		 * iterates through maintData
		 * set maintenance if zoneId machtes and maintenanceTime higher than unixTime
		 **/
		private function checkMaintenance():void
		{
			//instanceVO should be selected
			var instanceVO:InstanceVO = BasicModel.instanceProxy.selectedInstanceVO;
			var zoneId:String;
			var maintenanceTime:Number;
			var zoneInMaintenance:Boolean = false;
			for (zoneId in maintData)
			{
				maintenanceTime = maintData[ zoneId ];
				//current zone matches with zone in maintenance file
				if (instanceVO.zoneId == parseInt( zoneId ))
				{
					//finished maintenance time is higher than current unixtime?
					if (maintenanceTime > _utc)
					{
						//can used for formated timestring in the popup
						maintenanceTimeInSeconds = maintenanceTime - _utc;

						//time difference could be to long because of wrong client utc
						//loads ggs utc to confirm this time
						if (!ggsUTCLoaded && maintenanceTimeInSeconds > GGS_UTC_LOAD_TRIGGER_OFFSET_IN_SECONDS)
						{
							loadGgsUTC();
						}

						zoneInMaintenance = true;
						if (!maintenanceTimer || !maintenanceTimer.running)
						{
							startMaintenanceTimer();
						}
					}
					break;
				}
			}
			setMaintenance( zoneInMaintenance );
		}

		private function loadGgsUTC():void
		{
			var request:URLRequest = new URLRequest( UTC_REQUEST_URL );
			var loader:URLLoader = new URLLoader( request );
			loader.addEventListener( Event.COMPLETE, onLoadGGSUTCComplete );
			loader.addEventListener( IOErrorEvent.IO_ERROR, onLoadGGSUTCIOError );
			loader.addEventListener( SecurityErrorEvent.SECURITY_ERROR, onLoadGGSUTCSecurityError );
			loader.load( request );
		}

		/**
		 * executes setUTC
		 *
		 * @param event:Event
		 **/
		private function onLoadGGSUTCComplete( event:Event ):void
		{
			removeGgsUTCEventListener( event.target as URLLoader );
			setUTCFromGGSUTCService( event.target.data )
		}

		/**
		 * set utc from ggs utc service
		 * starts utcTimer
		 *
		 * @param data:Number
		 **/
		private function setUTCFromGGSUTCService( data:Number ):void
		{
			_utcStartTime = Number( data );
			ggsUTCLoaded = true;

			checkMaintenance();
		}

		/**
		 * starts maintenanceTimer with MAINTENANCE_TIMER_DELAY or maintenanceTimeInSeconds delay
		 **/
		private function startMaintenanceTimer():void
		{
			disposeMaintenanceReloadTimer();
			//closer time will be used as delay
			var delay:Number = Math.min( MAINTENANCE_TIMER_DELAY_IN_MS, maintenanceTimeInSeconds * 1000 );
			maintenanceTimer = new Timer( delay );
			maintenanceTimer.addEventListener( TimerEvent.TIMER, onMaintenanceReloadTimeout );
			maintenanceTimer.start();
		}

		/**
		 * executes loadMaintenanceFile
		 *
		 * @param event:TimerEvent
		 *
		 **/
		private function onMaintenanceReloadTimeout( event:TimerEvent ):void
		{
			loadMaintenanceFile();
		}

		/**
		 * check for loginIsKeyBased and executes specific maintenancemethod
		 *
		 * @param isMaintenance:Boolean
		 **/
		private function setMaintenance( isMaintenance:Boolean ):void
		{
			//maintenance deactivated via get parameter
			if (env.urlVariables.forcedMaintenance == ForcedMaintenanceEnum.OFF)
			{
				executeNoMaintenance();
			}
			else
			{
				// Check if is maintenance mode
				if (isMaintenance)
				{
					// Track MAINTENANCE_SCREEN event
					CommandController.instance.executeCommand( BasicController.COMMAND_USERTUNNEL_STATE, CommonGameStates.MAINTENANCE_SCREEN );
				}

				//maintenance is done
				if (env.maintenanceMode == true && isMaintenance == false)
				{
					env.maintenanceMode = isMaintenance;
					clearMaintenance();
				}
				//maintenance mode is currently active
				else if (env.maintenanceMode == true && isMaintenance == true)
				{
					updateMaintenance();
				}
				//otherwise
				else
				{
					env.maintenanceMode = isMaintenance;
					//env.urlVariables.forcedMaintenance comes from urlvars
					if (isMaintenance || env.urlVariables.forcedMaintenance == ForcedMaintenanceEnum.ON)
					{
						//social
						if (EnvGlobalsHandler.globals.loginIsKeyBased)
						{
							executeSocialMaintenance();
						}
						//normal world
						else
						{
							executeNWMaintenance();
						}
					}
					//no maintenance!
					else
					{
						executeNoMaintenance();
					}
				}
			}
		}

		/**
		 * Override this function
		 **/
		protected function updateMaintenance():void
		{
			//@override
		}

		/**
		 * Override this function
		 **/
		protected function clearMaintenance():void
		{
			disposeMaintenanceReloadTimer();
			executeNoMaintenance();
		}

		/**
		 * override this function
		 **/
		protected function executeNWMaintenance():void
		{
			executeNoMaintenance();
			throw new Error( "override this function executeNWMaintenanceStuff" );
		}

		/**
		 * Override this function
		 **/
		protected function executeSocialMaintenance():void
		{
			executeNoMaintenance();
			throw new Error( "override this function executeSocialMaintenance" );
		}

		/**
		 * typically do Connect
		 **/
		protected function executeNoMaintenance():void
		{
			if (noMaintenanceCommandName != null)
			{
				CommandController.instance.executeCommand( noMaintenanceCommandName );
			}
			else
			{
				info( "No noMaintenanceCommandName set! Nothing will happen!" );
			}
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private function onMaintenanceFileSecurityError( event:SecurityErrorEvent ):void
		{
			executeNoMaintenance();

			fatal( "SecurityError (" + event.text + ") while loading Maintenancecheck" );

			ExternalLog.logger.log(
				new SecurityErrorLOFactory(
					SecurityErrorLOFactory.GENERAL_LOADER_SECURITY_ERROR,
					event.text,
					PathProvider.instance.maintenanceConfigURL
				)
			);

			removeMaintenaceFileEventListener( event.target as URLLoader );
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private function onMaintenanceFileIOError( event:IOErrorEvent ):void
		{
			executeNoMaintenance();

			fatal( "IOError (" + event.text + ") while loading Maintenancecheck" );

			ExternalLog.logger.log(
				new IOErrorLOFactory(
					IOErrorLOFactory.GENERAL_LOADER_IO_ERROR,
					event.text,
					PathProvider.instance.maintenanceConfigURL
				)
			);

			removeMaintenaceFileEventListener( event.target as URLLoader );
		}

		private function removeMaintenaceFileEventListener( loader:URLLoader ):void
		{
			loader.removeEventListener( IOErrorEvent.IO_ERROR, onMaintenanceFileIOError );
			loader.removeEventListener( SecurityErrorEvent.SECURITY_ERROR, onMaintenanceFileSecurityError );
			loader.removeEventListener( Event.COMPLETE, onMaintenanceFileComplete );
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private function onLoadGGSUTCSecurityError( event:SecurityErrorEvent ):void
		{
			clearMaintenance();
			fatal( "SecurityError (" + event.text + ") while loading UTC" );
			ExternalLog.logger.log( new SecurityErrorLOFactory( SecurityErrorLOFactory.GENERAL_LOADER_SECURITY_ERROR, event.text, UTC_REQUEST_URL ) );
			removeGgsUTCEventListener( event.target as URLLoader );
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private function onLoadGGSUTCIOError( event:IOErrorEvent ):void
		{
			clearMaintenance();
			fatal( "IOError (" + event.text + ") while loading UTC" );
			ExternalLog.logger.log( new IOErrorLOFactory( IOErrorLOFactory.GENERAL_LOADER_IO_ERROR, event.text, UTC_REQUEST_URL ) );
			removeGgsUTCEventListener( event.target as URLLoader );
		}

		private function removeGgsUTCEventListener( loader:URLLoader ):void
		{
			loader.removeEventListener( IOErrorEvent.IO_ERROR, onLoadGGSUTCIOError );
			loader.removeEventListener( SecurityErrorEvent.SECURITY_ERROR, onLoadGGSUTCSecurityError );
			loader.removeEventListener( Event.COMPLETE, onLoadGGSUTCComplete );
		}

		/**
		 * dispose maintenanceTimer
		 **/
		private function disposeMaintenanceReloadTimer():void
		{
			if (maintenanceTimer)
			{
				maintenanceTimer.stop();
				maintenanceTimer.removeEventListener( TimerEvent.TIMER, onMaintenanceReloadTimeout );
				maintenanceTimer = null;
			}
		}

		protected final function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}

		// instead of updating the time every second with a timer running
		// we calculate the time when need by adding an offset to the utc calculate at the beginning.
		private function get _utc():Number
		{
			return _utcStartTime + ((getTimer() - _timeAtStart) * .001); // *.001 = /1000 ==> faster
		}
	}
}
