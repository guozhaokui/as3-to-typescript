/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 19.08.13, 17:08
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { ServerErrorVO } from "./vo/ServerErrorVO";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicHandleServerErrorCommand extends SimpleCommand
	{
		/*override*/ public /*final*/ execute( commandVars:Object = null ):void
		{
			var vo:ServerErrorVO = (<ServerErrorVO>commandVars );

			this.handleGameSpecificServerError( vo );
		}

		protected handleGameSpecificServerError( errorVO:ServerErrorVO ):void
		{
			//
		}
	}
