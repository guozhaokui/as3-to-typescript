/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 24.02.14
 * Time: 11:44
 * To change this template use File | Settings | File Templates.
 */


	import { BasicUsertunnelStateCommand } from "../BasicUsertunnelStateCommand";

	export class PlaytimeFirstInstanceCommand extends BasicUsertunnelStateCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			this.nonLinearTrackingFeatureUsed = false;

			super.execute( commandVars );
		}
	}

