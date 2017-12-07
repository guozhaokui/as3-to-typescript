/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 19:20
 * To change this template use File | Settings | File Templates.
 */


	export class ConnectionTrackingCommandVO
	{
		public delay:number;
		public roundTrip:string;
		public bluebox:number;

		constructor( delay:number, roundTrip:string, bluebox:number ){
			this.delay = delay;
			this.roundTrip = roundTrip;
			this.bluebox = bluebox;
		}
	}

