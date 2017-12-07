/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 23.09.13
 * Time: 16:42
 * To change this template use File | Settings | File Templates.
 */


	export class BasicPaymentShopClickTrackingVO
	{
		public sessionId:number
		public clickSourceId:number;

		constructor( shopId:number, clickSourceID:number = 0 ){
			this.sessionId = shopId;
			this.clickSourceId = clickSourceID;
		}
	}

