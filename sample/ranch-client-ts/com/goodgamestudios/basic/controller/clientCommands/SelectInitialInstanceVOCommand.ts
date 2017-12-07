/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 22.08.13, 16:06
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { error } from "../../../logging/error";
	import { info } from "../../../logging/info";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class SelectInitialInstanceVOCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var preselectedInstanceVO:InstanceVO;

			if (!BasicModel)
			{
				error( "BasicModel must be initialized." );
			}

			var instanceOriginInformation:string;

			// Prefer a preset instanceId passed by Flashvars first
			if (EnvGlobalsHandler.globals.flashVars.presetInstanceId && EnvGlobalsHandler.globals.flashVars.presetInstanceId != 0)
			{
				preselectedInstanceVO = BasicModel.instanceProxy.getInstanceVOByID( EnvGlobalsHandler.globals.flashVars.presetInstanceId );

				instanceOriginInformation = "Take instance passed via Flashvars";
			}
			// Verify if there is a friend invite code
			else if (EnvGlobalsHandler.globals.urlVariables.friendInviteCode && EnvGlobalsHandler.globals.urlVariables.friendInviteCode != "")
			{
				preselectedInstanceVO = BasicModel.instanceProxy.getInstanceVOByZoneID( EnvGlobalsHandler.globals.urlVariables.friendInviteZoneId );

				instanceOriginInformation = "Take instance passed via Friend Invite Code";
			}
			// Check if an instance is saved in the SharedObject
			else if (BasicModel.networkCookie.hasInstanceId)
			{
				var instanceID:number = BasicModel.networkCookie.instanceId;
				preselectedInstanceVO = BasicModel.instanceProxy.getInstanceVOByID( instanceID );

				instanceOriginInformation = "Take InstanceVO from SharedObject";
			}
			// Preselect best instance depending on the current country
			else
			{
				preselectedInstanceVO = BasicModel.instanceProxy.getPreferredInstanceVOForCurrentCountry();

				instanceOriginInformation = "InstanceVO mapped depending on country/network settings";
			}

			// TODO: This have to be refactored!
			if (!preselectedInstanceVO)
			{
				preselectedInstanceVO = BasicModel.instanceProxy.instanceMap[0];
				error( "No instance could be selected, take first existing instance instead: " + preselectedInstanceVO );
			}
			else
			{
				info( instanceOriginInformation + ": " + preselectedInstanceVO );
			}

			// Set instance
			BasicModel.instanceProxy.selectedInstanceVO = preselectedInstanceVO;

			// Store selected instance on network cookie
			BasicModel.networkCookie.instanceId = BasicModel.instanceProxy.selectedInstanceVO.instanceId;
		}
	}
