/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 23.09.13
 * Time: 16:42
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking.vo
{

	public class BasicPaymentShopClickTrackingVO
	{
		public var sessionId:Number
		public var clickSourceId:int;

		public function BasicPaymentShopClickTrackingVO( shopId:Number, clickSourceID:int = 0 )
		{
			sessionId = shopId;
			clickSourceId = clickSourceID;
		}
	}
}
