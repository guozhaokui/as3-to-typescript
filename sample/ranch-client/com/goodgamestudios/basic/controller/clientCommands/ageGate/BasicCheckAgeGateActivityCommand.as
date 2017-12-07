/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 27.11.13, 11:21
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */
package com.goodgamestudios.basic.controller.clientCommands.ageGate
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.language.countries.AbstractGGSCountry;
	import com.goodgamestudios.language.countries.GGSCountryCodes;
	import com.goodgamestudios.logging.debug;

	public class BasicCheckAgeGateActivityCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var initialDetectedCountry:AbstractGGSCountry = commandVars as AbstractGGSCountry;

			// Check if AgeGate is active
			if(!EnvGlobalsHandler.globals.ageGateFeatureIsActive)
			{
				debug( "AgeGate feature is not activated");

				// Don't activate AgeGate feature
				BasicModel.ageGateData.isAgeGateActive = false;
				return;
			}

			// Activate AgeGate only for USA
			if (initialDetectedCountry.ggsCountryCode == GGSCountryCodes.USA)
			{
				var ageGateData:String = EnvGlobalsHandler.globals.accountCookie.ageGateData;

				// Age gate data exists: Age has been validated already
				if (ageGateData)
				{
					BasicModel.ageGateData.isAgeGateActive = false;
				}
				// Age not validate yet, activate age gate
				else
				{
					BasicModel.ageGateData.isAgeGateActive = true;
				}
			}

			debug( "isAgeGateActive: " + BasicModel.ageGateData.isAgeGateActive );
		}
	}
}