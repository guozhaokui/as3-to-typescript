/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicFirstSessionTrackingCommand;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.WorldAssignmentTrackingEvent;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	/**
	 * - fires the world assignment tracking event
	 */
	public class BasicWorldAssignmentTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		// This command must be executed only once.
		private var _commandWasExecuted:Boolean;

		override public function execute( commandVars:Object = null ):void
		{
			if (!commandIsAllowed || _commandWasExecuted)
			{
				return;
			}

			var worldAssignmentTrackingEvent:WorldAssignmentTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.WORLD_ASSIGNMENT ) as WorldAssignmentTrackingEvent;
			worldAssignmentTrackingEvent.currCountry = GGSCountryController.instance.currentCountry;
			worldAssignmentTrackingEvent.cv = env.campainVars;
			worldAssignmentTrackingEvent.websiteId = env.urlVariables.websiteId;

			// TODO: Niko, this is a good topic to discuss: AccountId is tracked with every event as "accountId". Is it necessary to track this parameter as var_7 extra?
			worldAssignmentTrackingEvent.accountID = env.accountId;

			_commandWasExecuted = true;
			TrackingCache.getInstance().sendEvent( TrackingEventIds.WORLD_ASSIGNMENT );
		}
	}
}
