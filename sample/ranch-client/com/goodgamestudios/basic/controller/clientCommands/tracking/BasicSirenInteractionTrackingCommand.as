/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 15.04.14
 * Time: 18:13
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicTrackingCommand;
	import com.goodgamestudios.logging.warn;
	import com.goodgamestudios.marketing.google.CampaignVars;
	import com.goodgamestudios.tracking.SirenInteractionTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicSirenInteractionTrackingCommand extends BasicTrackingCommand
	{
		override public function execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the siren interaction information missing!" );
				return;
			}
			var sirenInteractionTrackingEvent:SirenInteractionTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.SIREN_INTERACTION ) as SirenInteractionTrackingEvent;
			sirenInteractionTrackingEvent.interactionType = int( objectVars );
			sirenInteractionTrackingEvent.cv = composeCampaignVars;
			TrackingCache.getInstance().sendEvent( TrackingEventIds.SIREN_INTERACTION );
		}

		private function get composeCampaignVars():String
		{
			var campaignVars:CampaignVars = env.campainVars;
			var campaignVarsObject:Object = {};
			var resultString:String = "";
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
}
