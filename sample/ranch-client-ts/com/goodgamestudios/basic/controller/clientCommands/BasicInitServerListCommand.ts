

	import { BasicModel } from "../../model/BasicModel";
	import { INetworkXMLBuilder } from "../../../net/socketserver/parser/INetworkXMLBuilder";
	import { NetworkXMLBuilder } from "../../../net/socketserver/parser/NetworkXMLBuilder";
	import { NetworkXMLParser } from "../../../net/socketserver/parser/NetworkXMLParser";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class BasicInitServerListCommand extends BasicClientCommand
	{
		/**
		 * This command can be executed from <code>BasicCacheBreaker</code> and <code>BasicFrameOne</code>, so we can't
		 * access directly the variable <code>env</code> variable, because it will get a instance from
		 * <code>EnvGlobalsHandler</code>, and <code>BasicCacheBreaker</code> is only initializing <code>BasicEnvironmentGlobals</code>.
		 *
		 * The parameter <code>commandVars</code> have to receive the information <code>isTestOrDevEnvironment</code> from who is calling the command.
		 * @param commandVars
		 */
		/*override*/ public /*final*/ execute( commandVars:Object = null ):void
		{
			var isTest:boolean = (<Boolean>commandVars.isTest );
			var forceToShowTestServers:boolean = (<Boolean>commandVars.forceToShowTestServers );
			var networkData:XML = (<XML>commandVars.networkData );

			var networkBuilder:INetworkXMLBuilder = new NetworkXMLBuilder();
			var networkParser:NetworkXMLParser = new NetworkXMLParser( networkBuilder );

			// Global network settings
			BasicModel.networkData.initialize( networkParser.parseNetworkSettings( networkData ) );

			//// Live instances
			var instancesLive:InstanceVO[];

			// Parse live instances
			instancesLive = networkParser.parseServerInstances( networkData[ "instances" ].children() );

			// Save live InstanceVOs
			BasicModel.instanceProxy.addInstances( instancesLive );

			// Add "test" and "dev" instances
			if (isTest || forceToShowTestServers)
			{
				//////////////////
				// TEST instances
				//////////////////
				var instancesTest:InstanceVO[];

				// Parse test instances
				instancesTest = networkParser.parseServerInstances( networkData[ "test-instances" ].children() );

				// Save test instances
				BasicModel.instanceProxy.addInstances( instancesTest );

				//////////////////
				// DEV instances
				//////////////////
				this.initAdditionalServer();
			}

			// Validate network settings
			BasicModel.networkData.validateNetworkConfigurationPlausibility();

			BasicModel.instanceProxy.printInstances();
		}

		/**
		 * Override this method and add your dev servers here
		 */
		protected initAdditionalServer():void
		{
			//overwrite with custom parameters
		}
	}
