/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 22.08.13, 10:26
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicRequestSocialLoginKeysCommand extends SimpleCommand
	{
		/*override*/ /*final*/ public execute( commandVars:Object = null ):void
		{
			BasicModel.socialData.requestLoginKeys();
		}
	}

