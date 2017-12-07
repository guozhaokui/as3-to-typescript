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
package com.goodgamestudios.basic.controller.clientCommands.ageGate
{

	import com.goodgamestudios.ageGate.AgeGateValidator;
	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.vo.AgeGateValidationVO;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.error;

	public class BasicValidateAgeCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var vo:AgeGateValidationVO = commandVars as AgeGateValidationVO;

			if (!vo)
			{
				error( "AgeGateValidationVO is null" );
			}

			// Validate age
			var validationResult:Boolean = AgeGateValidator.validate( vo.age );

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
}