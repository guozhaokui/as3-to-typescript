/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 27.11.13, 15:59
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { AgeGateValidator } from "../../../../ageGate/AgeGateValidator";
	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { BasicModel } from "../../../model/BasicModel";
	import { AgeGateValidationVO } from "../../../vo/AgeGateValidationVO";
	import { SimpleCommand } from "../../../../commanding/SimpleCommand";
	import { debug } from "../../../../logging/debug";
	import { error } from "../../../../logging/error";

	export class BasicValidateAgeCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var vo:AgeGateValidationVO = (<AgeGateValidationVO>commandVars );

			if (!vo)
			{
				error( "AgeGateValidationVO is null" );
			}

			// Validate age
			var validationResult:boolean = AgeGateValidator.validate( vo.age );

			// Store if the validation was successful
			BasicModel.ageGateData.validationSucceeded = validationResult;

			// Store age in account cookie if validation was successful
			// Reason: It's a legal issue that it's not allowed to store data of users under the specified age
			if (BasicModel.ageGateData.validationSucceeded)
			{
				EnvGlobalsHandler.globals.accountCookie.ageGateData = vo.age.toString();
			}

			debug( "Validate age: " + vo.age + ", Validation successful: " + BasicModel.ageGateData.validationSucceeded );

			// Execute callback
			vo.onValidationFinished( validationResult );

			// Dispose VO
			vo.onValidationFinished = null;
			vo = null;
		}
	}
