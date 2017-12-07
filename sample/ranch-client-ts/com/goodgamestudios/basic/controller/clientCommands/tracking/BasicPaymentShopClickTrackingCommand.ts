/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 23.09.13
 * Time: 16:36
 * To change this template use File | Settings | File Templates.
 */


	import { BasicTrackingCommand } from "./basis/BasicTrackingCommand";
	import { BasicPaymentShopClickTrackingVO } from "./vo/BasicPaymentShopClickTrackingVO";
	import { BasicModel } from "../../../model/BasicModel";
	import { GamePaymentShopClickEvent } from "../../../../tracking/GamePaymentShopClickEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { DeviceId } from "../../../../tracking/constants/DeviceId";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	/**
	 * - fires the gamePaymentShopClickEvent.
	 */
	export class BasicPaymentShopClickTrackingCommand extends BasicTrackingCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (!this.commandIsAllowed)
			{
				return;
			}

			var paymentVO:BasicPaymentShopClickTrackingVO = (<BasicPaymentShopClickTrackingVO>commandVars );
			var gamePaymentShopClickEvent:GamePaymentShopClickEvent = (<GamePaymentShopClickEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.GAME_PAYMENT_SHOP_CLICK ) );
			gamePaymentShopClickEvent.sessionId = paymentVO.sessionId.toString();
			gamePaymentShopClickEvent.date = (paymentVO.sessionId / 1000).toFixed();
			gamePaymentShopClickEvent.clickSourceId = paymentVO.clickSourceId;
			gamePaymentShopClickEvent.playerId = BasicModel.userData.playerID;
			gamePaymentShopClickEvent.deviceId = DeviceId.DESKTOP;

			TrackingCache.getInstance().sendEvent( TrackingEventIds.GAME_PAYMENT_SHOP_CLICK );
		}
	}

