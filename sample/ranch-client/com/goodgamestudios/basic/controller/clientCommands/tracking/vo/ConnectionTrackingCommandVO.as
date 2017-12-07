/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 19:20
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking.vo
{

	public class ConnectionTrackingCommandVO
	{
		public var delay:Number;
		public var roundTrip:String;
		public var bluebox:int;

		public function ConnectionTrackingCommandVO( delay:Number, roundTrip:String, bluebox:int )
		{
			this.delay = delay;
			this.roundTrip = roundTrip;
			this.bluebox = bluebox;
		}
	}
}
