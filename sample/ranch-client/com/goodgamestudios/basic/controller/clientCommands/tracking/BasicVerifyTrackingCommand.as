/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 07.10.13
 * Time: 09:28
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.tracking.verification.TrackingVerificationPatternGenerator;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.tracking.TrackingCache;

	/**
	 * This command determines a current tracking case/pattern and starts the verification.
	 * If user is the first Visitor, we need to start the verification after three minutes
	 * (because of Events, which are fired after the specific delays).
	 */
	public class BasicVerifyTrackingCommand extends SimpleCommand
	{
		private static const VERIFICATION_DELAY_FOR_FIRST_SESSION:int = 180000;

		override public function execute( commandVars:Object = null ):void
		{
			var trackingCase:String = currentTrackingCase;

			// Tracking pattern generator returns the array with all events, which are defined for the current tracking case
			var trackingPattern:Array = TrackingVerificationPatternGenerator.getPattern( trackingCase );

			if (env.doUserTunnelTracking)
			{
				TrackingCache.getInstance().trackingVerifier.startVerification( trackingCase, trackingPattern, VERIFICATION_DELAY_FOR_FIRST_SESSION );
			}
			else
			{
				TrackingCache.getInstance().trackingVerifier.startVerification( trackingCase, trackingPattern );
			}
		}

		/**
		 * Current tracking case is determined with a help of specific environment globals.
		 */
		private function get currentTrackingCase():String
		{
			if (!env.doUserTunnelTracking)
			{
				return TrackingVerificationPatternGenerator.CLASSIC_STANDARD_PATTERN;
			}
			else if (env.isSSO)
			{
				return TrackingVerificationPatternGenerator.CLASSIC_FIRST_INSTANCE_SSO_PATTERN;
			}
			else if (env.userFromLandingPage)
			{
				return TrackingVerificationPatternGenerator.CLASSIC_FIRST_INSTANCE_LP_PATTERN;
			}
			else
			{
				return TrackingVerificationPatternGenerator.CLASSIC_FIRST_INSTANCE_WWW_PATTERN;
			}
		}

		private function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}
