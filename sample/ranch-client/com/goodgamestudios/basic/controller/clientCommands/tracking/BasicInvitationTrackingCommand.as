package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.basis.BasicTrackingCommand;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.InvitationTrackingCommandVO;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.warn;
	import com.goodgamestudios.tracking.InvitationTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicInvitationTrackingCommand extends BasicTrackingCommand
	{
		override public function execute( objectVars:Object = null ):void
		{
			if (!objectVars)
			{
				warn( "Object with the invitation information missing!" );
				return;
			}

			var event:InvitationTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.INVITATION ) as InvitationTrackingEvent;

			var inviteVo:InvitationTrackingCommandVO = objectVars as InvitationTrackingCommandVO

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
}
