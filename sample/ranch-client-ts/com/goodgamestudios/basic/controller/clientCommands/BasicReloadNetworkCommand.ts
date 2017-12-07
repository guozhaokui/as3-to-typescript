/**
 * Created with IntelliJ IDEA.
 * User: Aaron Adams
 * Date: 13.06.12
 * Time: 16:23
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { BasicConstants } from "../../constants/BasicConstants";
	import { BasicController } from "../BasicController";
	import { PathProvider } from "../../environment/providers/PathProvider";
	import { BasicModel } from "../../model/BasicModel";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { GGSCountryController } from "../../../language/countryMapper/GGSCountryController";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	import URLLoaderDataFormat = createjs.URLLoaderDataFormat;

	export class BasicReloadNetworkCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			this.reloadNetworkXML();
			this.reloadInstances();
		}

		public reloadNetworkXML():void
		{
			BasicModel.basicLoaderData.appLoader.addXMLLoader(
				BasicConstants.NETWORK_INFO_LOADER,
				PathProvider.instance.networkConfigURL,
				URLLoaderDataFormat.BINARY,
				this.onReloadNetworkXML,
				true
			);
		}

		private onReloadNetworkXML():void
		{
			var networkData:XML = XML( BasicModel.basicLoaderData.appLoader.getLoaderData( BasicConstants.NETWORK_INFO_LOADER ) );

			this.env.defaultInstanceId = parseInt( networkData.general.defaultinstance.text() );
			this.env.allowedfullscreen = ((networkData.general.allowedfullscreen == "true"));
			this.env.networknameString = networkData.general.networkname.text();
			this.env.loginIsKeyBased = ((networkData.general.usekeybaselogin == "true"));
			this.env.hasNetworkBuddies = ((networkData.general.networkbuddies == "true"));
			this.env.enableFeedMessages = ((networkData.general.enablefeedmessages == "true"));
			this.env.enableLonelyCow = ((networkData.general.enablelonelycow == "true"));
			this.env.requestPayByJS = ((networkData.general.requestpaybyjs == "true"));
			this.env.networkNewsByJS = ((networkData.general.networknewsbyjs == "true"));
			this.env.earnCredits = parseInt( networkData.general.earncredits );
			this.env.useexternallinks = ((networkData.general.useexternallinks == "true"));
			this.env.invitefriends = ((networkData.general.invitefriends == "true"));
			this.env.maxUsernameLength = parseInt( networkData.general.maxusernamelength.text() );
			this.env.usePayment = ((networkData.general.usepayment == "true"));
			this.env.showVersion = ((networkData.general.showversion == "true"));

			delete networkData.instance[ 0 ];

			//CommandController.instance.executeCommand(BasicController.COMMAND_INIT_SERVERLIST, { serverInstances:instances });
			CommandController.instance.executeCommand( BasicController.COMMAND_UPDATE_NETWORK, BasicNetworkUpdateCommand );
		}

		public reloadInstances():void
		{
			var defaultInstanceVO:InstanceVO = BasicModel.instanceProxy.getInstanceVOByID( this.env.defaultInstanceId );

			var defaultCountry:string = "default";

			if (defaultInstanceVO)
			{
				defaultCountry = defaultInstanceVO.defaultcountry;
			}

			if (defaultCountry != "default" && defaultCountry != "")
			{
				GGSCountryController.instance.currentCountryByCountryCode = defaultCountry;
			}

			var preselectedInstanceID:number;

			if (this.env.flashVars.presetInstanceId == 0)
			{
				var instances:InstanceVO[] = BasicModel.instanceProxy.getInstancesForActualCountry();
				instances.length = 0;

				if (instances.length > 0)
				{
					var instanceVO:InstanceVO = instances[ 0 ];

					if (!instanceVO.isInternational)
					{
						preselectedInstanceID = instanceVO.instanceId;
					}
					else
					{
						preselectedInstanceID = this.env.defaultInstanceId;
					}
				}
			}
			else
			{
				this.env.forceInstanceConnect = true;
				preselectedInstanceID = this.env.flashVars.presetInstanceId;
			}

			BasicModel.instanceProxy.selectedInstanceVO = BasicModel.instanceProxy.getInstanceVOByID( preselectedInstanceID );
		}

		private get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
