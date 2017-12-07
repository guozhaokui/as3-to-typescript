

	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { BasicTrackingCommand } from "./basis/BasicTrackingCommand";
	import { InvitationTrackingCommandVO } from "./vo/InvitationTrackingCommandVO";
	import { BasicModel } from "../../../model/BasicModel";
	import { debug } from "../../../../logging/debug";
	import { warn } from "../../../../logging/warn";
	import { InvitationTrackingEvent } from "../../../../tracking/InvitationTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	export class BasicInvitationTrackingCommand extends BasicTrackingCommand
	{
		/*override*/ public execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:InvitationTrackingEvent = (<InvitationTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.INVITATION ) );

			var inviteVo:InvitationTrackingCommandVO = (<InvitationTrackingCommandVO>objectVars )

			event.playerId = BasicModel.userData.playerID;
			//  facebook invitation event requires inviter/sender data to be sent
			// if the event is sent FROM the receiver (ie invite accept /invalid) sender data must be filled manually by client
			// currently for classic games this behaviour is not occurring (see EP-40554 / RA-27630) but might come soon, so implementation is ready, but for backward compatibility, data is filled automatically

			if (inviteVo.inviterPlayerId == 0)
			{
				event.senderPlayerId = BasicModel.userData.playerID;
			}
			else
			{
				event.senderPlayerId = inviteVo.inviterPlayerId;
			}
			if (inviteVo.inviterInstanceId == 0)
			{
				event.senderInstanceId = BasicModel.instanceProxy.selectedInstanceVO.instanceId;
			}
			else
			{
				event.senderInstanceId = inviteVo.inviterInstanceId;
			}

			if (inviteVo.inviterNetworkId == 0)
			{
				event.senderNetworkId = EnvGlobalsHandler.globals.networkId;
			}
			else
			{
				event.senderNetworkId = inviteVo.inviterNetworkId;
			}
			if (inviteVo.inviterGameId == 0)
			{
				event.senderGameId = EnvGlobalsHandler.globals.gameId;
			}
			else
			{
				event.senderGameId = inviteVo.inviterGameId;
			}

			event.senderGameId = EnvGlobalsHandler.globals.gameId;
			event.senderExternalId = inviteVo.inviterExternalId;
			event.senderLevel = BasicModel.userData.userLevel;

			event.receiverPlayerId = inviteVo.inviteePlayerId;
			event.receiverInstanceId = inviteVo.inviteeInstanceId;
			event.receiverNetworkId = inviteVo.inviteeNetworkId;
			event.receiverGameId = inviteVo.inviteeGameId;
			event.receiverExternalId = inviteVo.inviteeExternalId;

			event.action = inviteVo.action;
			event.trigger = inviteVo.trigger;
			event.referMethod = inviteVo.referMethod;

			debug( "Tracking event fired. Attributes: senderID=" + BasicModel.userData.playerID + ", receiverID=" + inviteVo.inviteePlayerId + ", action=" + inviteVo.action );
			TrackingCache.getInstance().sendEvent( TrackingEventIds.INVITATION );
		}
	}

