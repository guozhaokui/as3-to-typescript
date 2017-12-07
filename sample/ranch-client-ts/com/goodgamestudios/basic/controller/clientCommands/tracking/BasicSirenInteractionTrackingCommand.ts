/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 15.04.14
 * Time: 18:13
 * To change this template use File | Settings | File Templates.
 */


	import { BasicTrackingCommand } from "./basis/BasicTrackingCommand";
	import { warn } from "../../../../logging/warn";
	import { CampaignVars } from "../../../../marketing/google/CampaignVars";
	import { SirenInteractionTrackingEvent } from "../../../../tracking/SirenInteractionTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	export class BasicSirenInteractionTrackingCommand extends BasicTrackingCommand
	{
		/*override*/ public execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the siren interaction information missing!" );
				return;
			}
			var sirenInteractionTrackingEvent:SirenInteractionTrackingEvent = (<SirenInteractionTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.SIREN_INTERACTION ) );
			sirenInteractionTrackingEvent.interactionType = Number( objectVars );
			sirenInteractionTrackingEvent.cv = this.composeCampaignVars;
			TrackingCache.getInstance().sendEvent( TrackingEventIds.SIREN_INTERACTION );
		}

		private get composeCampaignVars():string
		{
			var campaignVars:CampaignVars = this.env.campainVars;
			var campaignVarsObject:Object = {};
			var resultString:string = "";
			campaignVarsObject.pid = campaignVars.partnerId;
			campaignVarsObject.creative = campaignVars.creative;
			campaignVarsObject.placement = campaignVars.placement;
			campaignVarsObject.keyword = campaignVars.keyword;
			campaignVarsObject.network = campaignVars.network;
			campaignVarsObject.lp = campaignVars.lp;
			campaignVarsObject.cid = campaignVars.channelId;
			campaignVarsObject.tid = campaignVars.trafficSource;
			campaignVarsObject.aid = campaignVars.aid;
			campaignVarsObject.camp = campaignVars.camp;
			campaignVarsObject.adgr = campaignVars.adgr;
			campaignVarsObject.matchtype = campaignVars.matchtype;
			campaignVarsObject.gid = "";
			campaignVarsObject.country = campaignVars.country;
			resultString = JSON.stringify( campaignVarsObject );
			return resultString;
		}
	}

