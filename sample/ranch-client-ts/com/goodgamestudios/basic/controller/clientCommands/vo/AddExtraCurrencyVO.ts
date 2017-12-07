/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 26.02.14
 * Time: 13:55
 * To change this template use File | Settings | File Templates.
 */


	export class AddExtraCurrencyVO
	{
		public paymentHash:string;
		public clickSourceId:number;
		public shopTab:number;

		constructor( currentPaymentHash:string, currentClickSourceId:number, currentShopTab:number ){
			this.paymentHash = currentPaymentHash;
			this.clickSourceId = currentClickSourceId;
			this.shopTab = currentShopTab;
		}
	}

