/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking.basis
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.commanding.SimpleCommand;

	/**
	 * Basic command for all standard tracking commands (without first-session conditions).
	 */
	public class BasicTrackingCommand extends SimpleCommand
	{
		public function get commandIsAllowed():Boolean
		{
			if (env.isLocal)
			{
				return false;
			}
			return true;
		}

		protected function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}
