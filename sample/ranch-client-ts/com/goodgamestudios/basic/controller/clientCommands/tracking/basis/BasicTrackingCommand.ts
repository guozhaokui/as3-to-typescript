/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../../../IEnvironmentGlobals";
	import { SimpleCommand } from "../../../../../commanding/SimpleCommand";

	/**
	 * Basic command for all standard tracking commands (without first-session conditions).
	 */
	export class BasicTrackingCommand extends SimpleCommand
	{
		public get commandIsAllowed():boolean
		{
			if (this.env.isLocal)
			{
				return false;
			}
			return true;
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

