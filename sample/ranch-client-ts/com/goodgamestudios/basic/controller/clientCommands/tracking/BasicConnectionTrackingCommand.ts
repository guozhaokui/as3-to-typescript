/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 19:17
 * To change this template use File | Settings | File Templates.
 */


	import { BasicFirstSessionTrackingCommand } from "./basis/BasicFirstSessionTrackingCommand";
	import { ConnectionTrackingCommandVO } from "./vo/ConnectionTrackingCommandVO";
	import { BasicModel } from "../../../model/BasicModel";
	import { ConnectionTrackingEvent } from "../../../../tracking/ConnectionTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	/**
	 * - fires the connection tracking event.
	 * - is executed thrice (after first connection with the server, one and two minutes).
	 */
	export class BasicConnectionTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		// It's necessary to fire every connection tracking event only once.
		// To control this process, we need a vector-object with 3 boolean values.
		private alreadyTrackedDelayList:boolean[] = [];

		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (!commandIsAllowed)
			{
				return;
			}

			var eventInfoObject:ConnectionTrackingCommandVO = (<ConnectionTrackingCommandVO>commandVars );
			var connectionTrackingEvent:ConnectionTrackingEvent = (<ConnectionTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.CONNECTION ) );

			connectionTrackingEvent.playerID = BasicModel.userData.playerID;
			connectionTrackingEvent.cv = this.env.campainVars;
			connectionTrackingEvent.delay = eventInfoObject.delay;
			connectionTrackingEvent.roundTrip = eventInfoObject.roundTrip;
			connectionTrackingEvent.bluebox = eventInfoObject.bluebox;

			// TODO: Niko, this is a good topic to discuss: AccountId is tracked with every event as "accountId". Is it necessary to track this parameter as var_7 extra?
			connectionTrackingEvent.accountId = this.env.accountId;

			var delayNumber:number = connectionTrackingEvent.delay / 60000;

			// Only once per delay
			if (!this.wasExecutedForDelay( delayNumber ))
			{
				this.alreadyTrackedDelayList[ delayNumber ] = true;
				TrackingCache.getInstance().sendEvent( TrackingEventIds.CONNECTION );
			}
		}

		private wasExecutedForDelay( delay:number ):boolean
		{
			return this.alreadyTrackedDelayList[ delay ];
		}
	}

