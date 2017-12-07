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
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.channels.ChannelConfigurator;
	import com.goodgamestudios.logging.channels.concrete.CountryDetectionLogChannel;
	import com.goodgamestudios.logging.channels.concrete.LoadingLogChannel;
	import com.goodgamestudios.logging.channels.concrete.SmartfoxClientLogChannel;
	import com.goodgamestudios.logging.constants.LoggingConstants;
	import com.jeromedecoster.logging.logmeister.LogMeister;
	import com.jeromedecoster.logging.logmeister.connectors.ILogMeisterConnector;
	import com.jeromedecoster.logging.logmeister.connectors.SosMaxConnector;
	import com.jeromedecoster.logging.logmeister.connectors.enums.Level;

	import flash.display.DisplayObjectContainer;

	public class BasicInitLoggerCommand extends SimpleCommand
	{
		protected var stage:DisplayObjectContainer;

		override final public function execute( commandVars:Object = null ):void
		{
			// For some loggers is necessary to have a instance of stage
			if(commandVars && commandVars is DisplayObjectContainer)
			{
				stage = commandVars as DisplayObjectContainer;
			}

			var sos:ILogMeisterConnector = new SosMaxConnector();
			sos.format = LoggingConstants.FORMAT_DEFAULT_SOS;

			// Default logger target
			LogMeister.addLogger( sos );

			// Log level default threshold
			LogMeister.setLevelThreshold( Level.DEBUG );

			configureCoreLogChannels();

			// Initialize custom settings
			configureLogger();

			// Logger enabling
			if (env.urlVariables.forceToShowLogger || env.isLocal || env.isTest)
			{
				enableLogger = true;
			}
			else
			{
				enableLogger = false;
			}
		}

		private function configureCoreLogChannels():void
		{
			// TODO: Live environment: Activate all channels
			var cc:Array = [];
			cc.push( CountryDetectionLogChannel );
			cc.push( LoadingLogChannel );
			cc.push( SmartfoxClientLogChannel );
//			cc.push( TrackingLogChannel );

			ChannelConfigurator.instance.addChannels( cc );
		}

		protected function configureLogger():void
		{
			// hook to override
		}

		private function set enableLogger( flag:Boolean ):void
		{
			LogMeister.setLevel( Level.ALL, flag );
		}

		protected function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}
