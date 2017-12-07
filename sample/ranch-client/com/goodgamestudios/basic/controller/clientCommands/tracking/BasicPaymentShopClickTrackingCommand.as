/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 23.09.13
 * Time: 16:36
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.BasicPaymentShopClickTrackingVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.tracking.GamePaymentShopClickEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.DeviceId;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	/**
	 * - fires the gamePaymentShopClickEvent.
	 */
	public class BasicPaymentShopClickTrackingCommand extends BasicTrackingCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			if (!commandIsAllowed)
			{
				return;
			}

			var paymentVO:BasicPaymentShopClickTrackingVO = commandVars as BasicPaymentShopClickTrackingVO;
			var gamePaymentShopClickEvent:GamePaymentShopClickEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.GAME_PAYMENT_SHOP_CLICK ) as GamePaymentShopClickEvent;
			gamePaymentShopClickEvent.sessionId = paymentVO.sessionId.toString();
			gamePaymentShopClickEvent.date = (paymentVO.sessionId / 1000).toFixed();
			gamePaymentShopClickEvent.clickSourceId = paymentVO.clickSourceId;
			gamePaymentShopClickEvent.playerId = BasicModel.userData.playerID;
			gamePaymentShopClickEvent.deviceId = DeviceId.DESKTOP;

			TrackingCache.getInstance().sendEvent( TrackingEventIds.GAME_PAYMENT_SHOP_CLICK );
		}
	}
}
