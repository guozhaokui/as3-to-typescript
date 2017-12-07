

	import { BasicController } from "../BasicController";
	import { IdleScreenEvent } from "../../event/IdleScreenEvent";
	import { BasicModel } from "../../model/BasicModel";
	import { CommandController } from "../../../commanding/CommandController";
	import { Localization } from "../../../core/localization/utils/Localization";
	import { LanguageVO } from "../../../core/localization/vos/LanguageVO";
	import { AbstractGGSCountry } from "../../../language/countries/AbstractGGSCountry";
	import { GGSCountryController } from "../../../language/countryMapper/GGSCountryController";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class BasicChangeCountryCommand extends BasicClientCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var currentCountry:AbstractGGSCountry = GGSCountryController.instance.currentCountry;
			var newCountry:AbstractGGSCountry = (<AbstractGGSCountry>commandVars );

			if (!newCountry)
			{
				return;
			}

			if (currentCountry.ggsCountryCode != newCountry.ggsCountryCode)
			{
				BasicController.getInstance().dispatchEvent( new IdleScreenEvent( IdleScreenEvent.SHOW ) );

				var currentInstanceID:number;

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
								this.env.neverUseAbbreviations,
								this.env.abbreviationThreshold,
								this.env.fractionalDigits,
								this.env.leadingZero,
								this.env.trailingZeros
						)
				);
				Localization.localizeReplacements = this.env.localizeReplacements;

				// set CDN from new country
				this.env.customCDN = GGSCountryController.instance.currentCountry.cdn;

				// write new country to network cookie
				BasicModel.localData.saveCountryData( GGSCountryController.instance.currentCountry.ggsCountryCode );

				// write new cdn to account cookie
				if (this.env.accountCookie != null)
				{
					this.env.accountCookie.cdn = this.env.activeCDN;
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
