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
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicRequestSocialLoginKeysCommand extends SimpleCommand
	{
		override final public function execute( commandVars:Object = null ):void
		{
			BasicModel.socialData.requestLoginKeys();
		}
	}
}
