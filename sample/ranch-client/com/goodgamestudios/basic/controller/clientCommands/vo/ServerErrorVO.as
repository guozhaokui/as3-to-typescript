/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 19.08.13, 17:10
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */
package com.goodgamestudios.basic.controller.clientCommands.vo
{

	public class ServerErrorVO
	{
		public var error:int;
		public var params:Array;
		public var commandId:String;

		public function ServerErrorVO( error:int, params:Array, commandId:String = "" )
		{
			this.error = error;
			this.params = params;
			this.commandId = commandId;
		}
	}
}