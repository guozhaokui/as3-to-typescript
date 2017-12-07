/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking.basis
{

	public class BasicFirstSessionTrackingCommand extends BasicTrackingCommand
	{
		override public function get commandIsAllowed():Boolean
		{
			return env.doUserTunnelTracking && !env.isLocal;
		}
	}
}
