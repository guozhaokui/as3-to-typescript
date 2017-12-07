/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 26.02.14
 * Time: 13:55
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.vo
{

	public class AddExtraCurrencyVO
	{
		public var paymentHash:String;
		public var clickSourceId:int;
		public var shopTab:int;

		public function AddExtraCurrencyVO( currentPaymentHash:String, currentClickSourceId:int, currentShopTab:int )
		{
			paymentHash = currentPaymentHash;
			clickSourceId = currentClickSourceId;
			shopTab = currentShopTab;
		}
	}
}
