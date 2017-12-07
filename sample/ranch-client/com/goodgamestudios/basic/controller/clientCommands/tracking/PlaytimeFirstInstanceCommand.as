/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 24.02.14
 * Time: 11:44
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.BasicUsertunnelStateCommand;

	public class PlaytimeFirstInstanceCommand extends BasicUsertunnelStateCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			nonLinearTrackingFeatureUsed = false;

			super.execute( commandVars );
		}
	}
}
