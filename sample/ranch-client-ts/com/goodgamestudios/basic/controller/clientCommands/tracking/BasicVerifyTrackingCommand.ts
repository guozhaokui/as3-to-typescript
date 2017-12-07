/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 07.10.13
 * Time: 09:28
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../../IEnvironmentGlobals";
	import { TrackingVerificationPatternGenerator } from "../../../tracking/verification/TrackingVerificationPatternGenerator";
	import { SimpleCommand } from "../../../../commanding/SimpleCommand";
	import { TrackingCache } from "../../../../tracking/TrackingCache";

	/**
	 * This command determines a current tracking case/pattern and starts the verification.
	 * If user is the first Visitor, we need to start the verification after three minutes
	 * (because of Events, which are fired after the specific delays).
	 */
	export class BasicVerifyTrackingCommand extends SimpleCommand
	{
		private static VERIFICATION_DELAY_FOR_FIRST_SESSION:number = 180000;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var trackingCase:string = this.currentTrackingCase;

			// Tracking pattern generator returns the array with all events, which are defined for the current tracking case
			var trackingPattern:any[] = TrackingVerificationPatternGenerator.getPattern( trackingCase );

			if (this.env.doUserTunnelTracking)
			{
				TrackingCache.getInstance().trackingVerifier.startVerification( trackingCase, trackingPattern, BasicVerifyTrackingCommand.VERIFICATION_DELAY_FOR_FIRST_SESSION );
			}
			else
			{
				TrackingCache.getInstance().trackingVerifier.startVerification( trackingCase, trackingPattern );
			}
		}

		/**
		 * Current tracking case is determined with a help of specific environment globals.
		 */
		private get currentTrackingCase():string
		{
			if (!this.env.doUserTunnelTracking)
			{
				return TrackingVerificationPatternGenerator.CLASSIC_STANDARD_PATTERN;
			}
			else if (this.env.isSSO)
			{
				return TrackingVerificationPatternGenerator.CLASSIC_FIRST_INSTANCE_SSO_PATTERN;
			}
			else if (this.env.userFromLandingPage)
			{
				return TrackingVerificationPatternGenerator.CLASSIC_FIRST_INSTANCE_LP_PATTERN;
			}
			else
			{
				return TrackingVerificationPatternGenerator.CLASSIC_FIRST_INSTANCE_WWW_PATTERN;
			}
		}

		private get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

