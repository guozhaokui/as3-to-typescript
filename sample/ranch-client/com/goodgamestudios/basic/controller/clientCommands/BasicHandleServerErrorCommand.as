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
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.clientCommands.vo.ServerErrorVO;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicHandleServerErrorCommand extends SimpleCommand
	{
		override public final function execute( commandVars:Object = null ):void
		{
			var vo:ServerErrorVO = commandVars as ServerErrorVO;

			handleGameSpecificServerError( vo );
		}

		protected function handleGameSpecificServerError( errorVO:ServerErrorVO ):void
		{
			//
		}
	}
}