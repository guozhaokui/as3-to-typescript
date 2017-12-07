

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { CommonGameStates } from "../../constants/CommonGameStates";
	import { BasicController } from "../BasicController";
	import { PathProvider } from "../../environment/providers/PathProvider";
	import { BasicModel } from "../../model/BasicModel";
	import { ForcedMaintenanceEnum } from "../../startup/ForcedMaintenanceEnum";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { ExternalLog } from "../../../externalLogging/ExternalLog";
	import { IOErrorLOFactory } from "../../../externalLogging/factories/IOErrorLOFactory";
	import { SecurityErrorLOFactory } from "../../../externalLogging/factories/SecurityErrorLOFactory";
	import { fatal } from "../../../logging/fatal";
	import { info } from "../../../logging/info";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	import Event = createjs.Event;
	import IOErrorEvent = createjs.IOErrorEvent;
	import SecurityErrorEvent = createjs.SecurityErrorEvent;
	import TimerEvent = createjs.TimerEvent;
	import URLLoader = createjs.URLLoader;
	import URLRequest = createjs.URLRequest;
	import Timer = createjs.Timer;
	import getTimer = createjs.getTimer;

	export class BasicCheckMaintenanceCommand extends SimpleCommand
	{
		private MAINTENANCE_TIMER_DELAY_IN_MS:number = 30000;
		private noMaintenanceCommandName:string;
		private maintenanceTimer:Timer;

		protected maintenanceTimeInSeconds:number;
		private maintData:Object;

		private GGS_UTC_LOAD_TRIGGER_OFFSET_IN_SECONDS:number = 300;
		private UTC_REQUEST_URL:string = "http://time.goodgamestudios.com";
		private _utcStartTime:number;
		private _timeAtStart:number;
		private utcTimer:Timer;
		private ggsUTCLoaded:boolean = false;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (commandVars == null)
			{
				this.noMaintenanceCommandName = null;
			}
			else
			{
				this.noMaintenanceCommandName = (<String>commandVars );
			}
			this.executeDefaultBehavior();
		}

		/**
		 * override this function if your project does not have any maintenance functionality
		 * use executeNoMaintenance in your overwritten method
		 *
		 **/
		protected executeDefaultBehavior():void
		{
			this.generateClientUTC();
			this.loadMaintenanceFile();
		}

		/**
		 * disposeMaintenanceReloadTimer
		 * initialize URLLoader
		 *
		 **/
		private loadMaintenanceFile():void
		{
			this.disposeMaintenanceReloadTimer();
			var request:URLRequest = new URLRequest( PathProvider.instance.maintenanceConfigURL );
			var loader:URLLoader = new URLLoader( request );
			loader.addEventListener( Event.COMPLETE, this.onMaintenanceFileComplete );
			loader.addEventListener( IOErrorEvent.IO_ERROR, this.onMaintenanceFileIOError );
			loader.addEventListener( SecurityErrorEvent.SECURITY_ERROR, this.onMaintenanceFileSecurityError );
			loader.load( request );
		}

		/**
		 * decode data
		 *
		 * @param event:Event
		 **/
		private onMaintenanceFileComplete( event:Event ):void
		{
			this.removeMaintenaceFileEventListener( (<URLLoader>event.target ) );
			//a json Object
			this.maintData = JSON.parse( event.target.data );
			this.checkMaintenance();
		}

		/**
		 * generate utc from Date object
		 **/
		private generateClientUTC():void
		{
			var dateStamp:Date = new Date();
			var unixTimeMilliseconds:number = Date.UTC( dateStamp.getUTCFullYear(), dateStamp.getUTCMonth(), dateStamp.getUTCDate(), dateStamp.getUTCHours(), dateStamp.getUTCMinutes(), dateStamp.getUTCSeconds(), dateStamp.getUTCMilliseconds() ).valueOf();
			this._utcStartTime = Math.round( unixTimeMilliseconds / 1000 );
			this._timeAtStart = getTimer();
		}

		/**
		 * iterates through maintData
		 * set maintenance if zoneId machtes and maintenanceTime higher than unixTime
		 **/
		private checkMaintenance():void
		{
			//instanceVO should be selected
			var instanceVO:InstanceVO = BasicModel.instanceProxy.selectedInstanceVO;
			var zoneId:string;
			var maintenanceTime:number;
			var zoneInMaintenance:boolean = false;
			for (zoneId in this.maintData)
			{
				maintenanceTime = this.maintData[ zoneId ];
				//current zone matches with zone in maintenance file
				if (instanceVO.zoneId == parseInt( zoneId ))
				{
					//finished maintenance time is higher than current unixtime?
					if (maintenanceTime > this._utc)
					{
						//can used for formated timestring in the popup
						this.maintenanceTimeInSeconds = maintenanceTime - this._utc;

						//time difference could be to long because of wrong client utc
						//loads ggs utc to confirm this time
						if (!this.ggsUTCLoaded && this.maintenanceTimeInSeconds > this.GGS_UTC_LOAD_TRIGGER_OFFSET_IN_SECONDS)
						{
							this.loadGgsUTC();
						}

						zoneInMaintenance = true;
						if (!this.maintenanceTimer || !this.maintenanceTimer.running)
						{
							this.startMaintenanceTimer();
						}
					}
					break;
				}
			}
			this.setMaintenance( zoneInMaintenance );
		}

		private loadGgsUTC():void
		{
			var request:URLRequest = new URLRequest( this.UTC_REQUEST_URL );
			var loader:URLLoader = new URLLoader( request );
			loader.addEventListener( Event.COMPLETE, this.onLoadGGSUTCComplete );
			loader.addEventListener( IOErrorEvent.IO_ERROR, this.onLoadGGSUTCIOError );
			loader.addEventListener( SecurityErrorEvent.SECURITY_ERROR, this.onLoadGGSUTCSecurityError );
			loader.load( request );
		}

		/**
		 * executes setUTC
		 *
		 * @param event:Event
		 **/
		private onLoadGGSUTCComplete( event:Event ):void
		{
			this.removeGgsUTCEventListener( (<URLLoader>event.target ) );
			this.setUTCFromGGSUTCService( event.target.data )
		}

		/**
		 * set utc from ggs utc service
		 * starts utcTimer
		 *
		 * @param data:Number
		 **/
		private setUTCFromGGSUTCService( data:number ):void
		{
			this._utcStartTime = Number( data );
			this.ggsUTCLoaded = true;

			this.checkMaintenance();
		}

		/**
		 * starts maintenanceTimer with MAINTENANCE_TIMER_DELAY or maintenanceTimeInSeconds delay
		 **/
		private startMaintenanceTimer():void
		{
			this.disposeMaintenanceReloadTimer();
			//closer time will be used as delay
			var delay:number = Math.min( this.MAINTENANCE_TIMER_DELAY_IN_MS, this.maintenanceTimeInSeconds * 1000 );
			this.maintenanceTimer = new Timer( delay );
			this.maintenanceTimer.addEventListener( TimerEvent.TIMER, this.onMaintenanceReloadTimeout );
			this.maintenanceTimer.start();
		}

		/**
		 * executes loadMaintenanceFile
		 *
		 * @param event:TimerEvent
		 *
		 **/
		private onMaintenanceReloadTimeout( event:TimerEvent ):void
		{
			this.loadMaintenanceFile();
		}

		/**
		 * check for loginIsKeyBased and executes specific maintenancemethod
		 *
		 * @param isMaintenance:Boolean
		 **/
		private setMaintenance( isMaintenance:boolean ):void
		{
			//maintenance deactivated via get parameter
			if (this.env.urlVariables.forcedMaintenance == ForcedMaintenanceEnum.OFF)
			{
				this.executeNoMaintenance();
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
				if (this.env.maintenanceMode == true && isMaintenance == false)
				{
					this.env.maintenanceMode = isMaintenance;
					this.clearMaintenance();
				}
				//maintenance mode is currently active
				else if (this.env.maintenanceMode == true && isMaintenance == true)
				{
					this.updateMaintenance();
				}
				//otherwise
				else
				{
					this.env.maintenanceMode = isMaintenance;
					//env.urlVariables.forcedMaintenance comes from urlvars
					if (isMaintenance || this.env.urlVariables.forcedMaintenance == ForcedMaintenanceEnum.ON)
					{
						//social
						if (EnvGlobalsHandler.globals.loginIsKeyBased)
						{
							this.executeSocialMaintenance();
						}
						//normal world
						else
						{
							this.executeNWMaintenance();
						}
					}
					//no maintenance!
					else
					{
						this.executeNoMaintenance();
					}
				}
			}
		}

		/**
		 * Override this function
		 **/
		protected updateMaintenance():void
		{
			//@override
		}

		/**
		 * Override this function
		 **/
		protected clearMaintenance():void
		{
			this.disposeMaintenanceReloadTimer();
			this.executeNoMaintenance();
		}

		/**
		 * override this function
		 **/
		protected executeNWMaintenance():void
		{
			this.executeNoMaintenance();
			throw new Error( "override this function executeNWMaintenanceStuff" );
		}

		/**
		 * Override this function
		 **/
		protected executeSocialMaintenance():void
		{
			this.executeNoMaintenance();
			throw new Error( "override this function executeSocialMaintenance" );
		}

		/**
		 * typically do Connect
		 **/
		protected executeNoMaintenance():void
		{
			if (this.noMaintenanceCommandName != null)
			{
				CommandController.instance.executeCommand( this.noMaintenanceCommandName );
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
		private onMaintenanceFileSecurityError( event:SecurityErrorEvent ):void
		{
			this.executeNoMaintenance();

			fatal( "SecurityError (" + event.text + ") while loading Maintenancecheck" );

			ExternalLog.logger.log(
				new SecurityErrorLOFactory(
					SecurityErrorLOFactory.GENERAL_LOADER_SECURITY_ERROR,
					event.text,
					PathProvider.instance.maintenanceConfigURL
				)
			);

			this.removeMaintenaceFileEventListener( (<URLLoader>event.target ) );
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private onMaintenanceFileIOError( event:IOErrorEvent ):void
		{
			this.executeNoMaintenance();

			fatal( "IOError (" + event.text + ") while loading Maintenancecheck" );

			ExternalLog.logger.log(
				new IOErrorLOFactory(
					IOErrorLOFactory.GENERAL_LOADER_IO_ERROR,
					event.text,
					PathProvider.instance.maintenanceConfigURL
				)
			);

			this.removeMaintenaceFileEventListener( (<URLLoader>event.target ) );
		}

		private removeMaintenaceFileEventListener( loader:URLLoader ):void
		{
			loader.removeEventListener( IOErrorEvent.IO_ERROR, this.onMaintenanceFileIOError );
			loader.removeEventListener( SecurityErrorEvent.SECURITY_ERROR, this.onMaintenanceFileSecurityError );
			loader.removeEventListener( Event.COMPLETE, this.onMaintenanceFileComplete );
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private onLoadGGSUTCSecurityError( event:SecurityErrorEvent ):void
		{
			this.clearMaintenance();
			fatal( "SecurityError (" + event.text + ") while loading UTC" );
			ExternalLog.logger.log( new SecurityErrorLOFactory( SecurityErrorLOFactory.GENERAL_LOADER_SECURITY_ERROR, event.text, this.UTC_REQUEST_URL ) );
			this.removeGgsUTCEventListener( (<URLLoader>event.target ) );
		}

		/**
		 * Fallback
		 * typically do Connect
		 **/
		private onLoadGGSUTCIOError( event:IOErrorEvent ):void
		{
			this.clearMaintenance();
			fatal( "IOError (" + event.text + ") while loading UTC" );
			ExternalLog.logger.log( new IOErrorLOFactory( IOErrorLOFactory.GENERAL_LOADER_IO_ERROR, event.text, this.UTC_REQUEST_URL ) );
			this.removeGgsUTCEventListener( (<URLLoader>event.target ) );
		}

		private removeGgsUTCEventListener( loader:URLLoader ):void
		{
			loader.removeEventListener( IOErrorEvent.IO_ERROR, this.onLoadGGSUTCIOError );
			loader.removeEventListener( SecurityErrorEvent.SECURITY_ERROR, this.onLoadGGSUTCSecurityError );
			loader.removeEventListener( Event.COMPLETE, this.onLoadGGSUTCComplete );
		}

		/**
		 * dispose maintenanceTimer
		 **/
		private disposeMaintenanceReloadTimer():void
		{
			if (this.maintenanceTimer)
			{
				this.maintenanceTimer.stop();
				this.maintenanceTimer.removeEventListener( TimerEvent.TIMER, this.onMaintenanceReloadTimeout );
				this.maintenanceTimer = null;
			}
		}

		protected /*final*/ get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}

		// instead of updating the time every second with a timer running
		// we calculate the time when need by adding an offset to the utc calculate at the beginning.
		private get _utc():number
		{
			return this._utcStartTime + ((getTimer() - this._timeAtStart) * .001); // *.001 = /1000 ==> faster
		}
	}

