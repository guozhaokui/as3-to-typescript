/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */


	import { BasicFirstSessionTrackingCommand } from "./basis/BasicFirstSessionTrackingCommand";
	import { GGSCountryController } from "../../../../language/countryMapper/GGSCountryController";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { WorldAssignmentTrackingEvent } from "../../../../tracking/WorldAssignmentTrackingEvent";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	/**
	 * - fires the world assignment tracking event
	 */
	export class BasicWorldAssignmentTrackingCommand extends BasicFirstSessionTrackingCommand
	{
		// This command must be executed only once.
		private _commandWasExecuted:boolean;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (!this.commandIsAllowed || this._commandWasExecuted)
			{
				return;
			}

			var worldAssignmentTrackingEvent:WorldAssignmentTrackingEvent = (<WorldAssignmentTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.WORLD_ASSIGNMENT ) );
			worldAssignmentTrackingEvent.currCountry = GGSCountryController.instance.currentCountry;
			worldAssignmentTrackingEvent.cv = this.env.campainVars;
			worldAssignmentTrackingEvent.websiteId = this.env.urlVariables.websiteId;

			// TODO: Niko, this is a good topic to discuss: AccountId is tracked with every event as "accountId". Is it necessary to track this parameter as var_7 extra?
			worldAssignmentTrackingEvent.accountID = this.env.accountId;

			this._commandWasExecuted = true;
			TrackingCache.getInstance().sendEvent( TrackingEventIds.WORLD_ASSIGNMENT );
		}
	}

