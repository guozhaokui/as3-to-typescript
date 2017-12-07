package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.event.IdleScreenEvent;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.core.localization.utils.Localization;
	import com.goodgamestudios.core.localization.vos.LanguageVO;
	import com.goodgamestudios.language.countries.AbstractGGSCountry;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	public class BasicChangeCountryCommand extends BasicClientCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var currentCountry:AbstractGGSCountry = GGSCountryController.instance.currentCountry;
			var newCountry:AbstractGGSCountry = commandVars as AbstractGGSCountry;

			if (!newCountry)
			{
				return;
			}

			if (currentCountry.ggsCountryCode != newCountry.ggsCountryCode)
			{
				BasicController.getInstance().dispatchEvent( new IdleScreenEvent( IdleScreenEvent.SHOW ) );

				var currentInstanceID:int;

				if (BasicModel.instanceProxy.selectedInstanceVO)
				{
					currentInstanceID = BasicModel.instanceProxy.selectedInstanceVO.instanceId;
				}

				// Set new country
				GGSCountryController.instance.currentCountry = newCountry;
				Localization.setLanguage(
						new LanguageVO(
								newCountry.ggsCountryCode,
								newCountry.ggsLanguageCode,
								env.neverUseAbbreviations,
								env.abbreviationThreshold,
								env.fractionalDigits,
								env.leadingZero,
								env.trailingZeros
						)
				);
				Localization.localizeReplacements = env.localizeReplacements;

				// set CDN from new country
				env.customCDN = GGSCountryController.instance.currentCountry.cdn;

				// write new country to network cookie
				BasicModel.localData.saveCountryData( GGSCountryController.instance.currentCountry.ggsCountryCode );

				// write new cdn to account cookie
				if (env.accountCookie != null)
				{
					env.accountCookie.cdn = env.activeCDN;
				}

				var newInstanceVO:InstanceVO;

				// Instance available for current country
				if (BasicModel.instanceProxy.isInstanceIDAvailableInCurrentCountry( currentInstanceID ))
				{
					newInstanceVO = BasicModel.instanceProxy.getInstanceVOByID( currentInstanceID );
				}
				// Instance unavailable
				else
				{
					newInstanceVO = BasicModel.instanceProxy.getPreferredInstanceVOForCurrentCountry();
				}

				//execute logout
				if (BasicModel.instanceProxy.selectedInstanceVO != newInstanceVO)
				{
					BasicModel.instanceProxy.selectedInstanceVO = newInstanceVO;
					CommandController.instance.executeCommand( BasicController.COMMAND_CONNECT_TO_INSTANCEVO, BasicModel.instanceProxy.selectedInstanceVO );
				}

				if (BasicModel.languageData)
				{
					if (currentCountry.ggsCountryCode != newCountry.ggsCountryCode)
					{
						CommandController.instance.executeCommand( BasicController.COMMAND_CHANGE_LANGUAGE );
					}
				}
			}
		}
	}
}