/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 06.08.13, 14:55
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { ChannelConfigurator } from "../../../logging/channels/ChannelConfigurator";
	import { CountryDetectionLogChannel } from "../../../logging/channels/concrete/CountryDetectionLogChannel";
	import { LoadingLogChannel } from "../../../logging/channels/concrete/LoadingLogChannel";
	import { SmartfoxClientLogChannel } from "../../../logging/channels/concrete/SmartfoxClientLogChannel";
	import { LoggingConstants } from "../../../logging/constants/LoggingConstants";
	import { LogMeister } from "../../../../jeromedecoster/logging/logmeister/LogMeister";
	import { ILogMeisterConnector } from "../../../../jeromedecoster/logging/logmeister/connectors/ILogMeisterConnector";
	import { SosMaxConnector } from "../../../../jeromedecoster/logging/logmeister/connectors/SosMaxConnector";
	import { Level } from "../../../../jeromedecoster/logging/logmeister/connectors/enums/Level";

	import DisplayObjectContainer = createjs.DisplayObjectContainer;

	export class BasicInitLoggerCommand extends SimpleCommand
	{
		protected stage:DisplayObjectContainer;

		/*override*/ /*final*/ public execute( commandVars:Object = null ):void
		{
			// For some loggers is necessary to have a instance of stage
			if(commandVars && commandVars instanceof DisplayObjectContainer)
			{
				this.stage = (<DisplayObjectContainer>commandVars );
			}

			var sos:ILogMeisterConnector = new SosMaxConnector();
			sos.format = LoggingConstants.FORMAT_DEFAULT_SOS;

			// Default logger target
			LogMeister.addLogger( sos );

			// Log level default threshold
			LogMeister.setLevelThreshold( Level.DEBUG );

			this.configureCoreLogChannels();

			// Initialize custom settings
			this.configureLogger();

			// Logger enabling
			if (this.env.urlVariables.forceToShowLogger || this.env.isLocal || this.env.isTest)
			{
				this.enableLogger = true;
			}
			else
			{
				this.enableLogger = false;
			}
		}

		private configureCoreLogChannels():void
		{
			// TODO: Live environment: Activate all channels
			var cc:any[] = [];
			cc.push( CountryDetectionLogChannel );
			cc.push( LoadingLogChannel );
			cc.push( SmartfoxClientLogChannel );
//			cc.push( TrackingLogChannel );

			ChannelConfigurator.instance.addChannels( cc );
		}

		protected configureLogger():void
		{
			// hook to override
		}

		private set enableLogger( flag:boolean )
		{
			LogMeister.setLevel( Level.ALL, flag );
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

