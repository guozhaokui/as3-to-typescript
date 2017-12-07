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


	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { BasicModel } from "../../../model/BasicModel";
	import { SimpleCommand } from "../../../../commanding/SimpleCommand";
	import { AbstractGGSCountry } from "../../../../language/countries/AbstractGGSCountry";
	import { GGSCountryCodes } from "../../../../language/countries/GGSCountryCodes";
	import { debug } from "../../../../logging/debug";

	export class BasicCheckAgeGateActivityCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var initialDetectedCountry:AbstractGGSCountry = (<AbstractGGSCountry>commandVars );

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
				var ageGateData:string = EnvGlobalsHandler.globals.accountCookie.ageGateData;

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
