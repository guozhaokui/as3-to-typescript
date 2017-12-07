/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 19:17
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicFirstSessionTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.ConnectionTrackingCommandVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.tracking.ConnectionTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	/**
	 * - fires the connection tracking event.
	 * - is executed thrice (after first connection with the server, one and two minutes).
	 */
	public class BasicConnectionTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		// It's necessary to fire every connection tracking event only once.
		// To control this process, we need a vector-object with 3 boolean values.
		private var alreadyTrackedDelayList:Vector.<Boolean> = new Vector.<Boolean>( 3 );

		override public function execute( commandVars:Object = null ):void
		{
			if (!commandIsAllowed)
			{
				return;
			}

			var eventInfoObject:ConnectionTrackingCommandVO = commandVars as ConnectionTrackingCommandVO;
			var connectionTrackingEvent:ConnectionTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.CONNECTION ) as ConnectionTrackingEvent;

			connectionTrackingEvent.playerID = BasicModel.userData.playerID;
			connectionTrackingEvent.cv = env.campainVars;
			connectionTrackingEvent.delay = eventInfoObject.delay;
			connectionTrackingEvent.roundTrip = eventInfoObject.roundTrip;
			connectionTrackingEvent.bluebox = eventInfoObject.bluebox;

			// TODO: Niko, this is a good topic to discuss: AccountId is tracked with every event as "accountId". Is it necessary to track this parameter as var_7 extra?
			connectionTrackingEvent.accountId = env.accountId;

			var delayNumber:int = connectionTrackingEvent.delay / 60000;

			// Only once per delay
			if (!wasExecutedForDelay( delayNumber ))
			{
				alreadyTrackedDelayList[ delayNumber ] = true;
				TrackingCache.getInstance().sendEvent( TrackingEventIds.CONNECTION );
			}
		}

		private function wasExecutedForDelay( delay:int ):Boolean
		{
			return alreadyTrackedDelayList[ delay ];
		}
	}
}
