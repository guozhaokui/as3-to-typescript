/**
 * Created with IntelliJ IDEA.
 * User: Aaron Adams
 * Date: 13.06.12
 * Time: 16:23
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.constants.BasicConstants;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.environment.providers.PathProvider;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	import flash.net.URLLoaderDataFormat;

	public class BasicReloadNetworkCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			reloadNetworkXML();
			reloadInstances();
		}

		public function reloadNetworkXML():void
		{
			BasicModel.basicLoaderData.appLoader.addXMLLoader(
				BasicConstants.NETWORK_INFO_LOADER,
				PathProvider.instance.networkConfigURL,
				URLLoaderDataFormat.BINARY,
				onReloadNetworkXML,
				true
			);
		}

		private function onReloadNetworkXML():void
		{
			var networkData:XML = XML( BasicModel.basicLoaderData.appLoader.getLoaderData( BasicConstants.NETWORK_INFO_LOADER ) );

			env.defaultInstanceId = parseInt( networkData.general.defaultinstance.text() );
			env.allowedfullscreen = ((networkData.general.allowedfullscreen == "true"));
			env.networknameString = networkData.general.networkname.text();
			env.loginIsKeyBased = ((networkData.general.usekeybaselogin == "true"));
			env.hasNetworkBuddies = ((networkData.general.networkbuddies == "true"));
			env.enableFeedMessages = ((networkData.general.enablefeedmessages == "true"));
			env.enableLonelyCow = ((networkData.general.enablelonelycow == "true"));
			env.requestPayByJS = ((networkData.general.requestpaybyjs == "true"));
			env.networkNewsByJS = ((networkData.general.networknewsbyjs == "true"));
			env.earnCredits = parseInt( networkData.general.earncredits );
			env.useexternallinks = ((networkData.general.useexternallinks == "true"));
			env.invitefriends = ((networkData.general.invitefriends == "true"));
			env.maxUsernameLength = parseInt( networkData.general.maxusernamelength.text() );
			env.usePayment = ((networkData.general.usepayment == "true"));
			env.showVersion = ((networkData.general.showversion == "true"));

			delete networkData.instance[ 0 ];

			//CommandController.instance.executeCommand(BasicController.COMMAND_INIT_SERVERLIST, { serverInstances:instances });
			CommandController.instance.executeCommand( BasicController.COMMAND_UPDATE_NETWORK, BasicNetworkUpdateCommand );
		}

		public function reloadInstances():void
		{
			var defaultInstanceVO:InstanceVO = BasicModel.instanceProxy.getInstanceVOByID( env.defaultInstanceId );

			var defaultCountry:String = "default";

			if (defaultInstanceVO)
			{
				defaultCountry = defaultInstanceVO.defaultcountry;
			}

			if (defaultCountry != "default" && defaultCountry != "")
			{
				GGSCountryController.instance.currentCountryByCountryCode = defaultCountry;
			}

			var preselectedInstanceID:int;

			if (env.flashVars.presetInstanceId == 0)
			{
				var instances:Vector.<InstanceVO> = BasicModel.instanceProxy.getInstancesForActualCountry();
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
						preselectedInstanceID = env.defaultInstanceId;
					}
				}
			}
			else
			{
				env.forceInstanceConnect = true;
				preselectedInstanceID = env.flashVars.presetInstanceId;
			}

			BasicModel.instanceProxy.selectedInstanceVO = BasicModel.instanceProxy.getInstanceVOByID( preselectedInstanceID );
		}

		private function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}