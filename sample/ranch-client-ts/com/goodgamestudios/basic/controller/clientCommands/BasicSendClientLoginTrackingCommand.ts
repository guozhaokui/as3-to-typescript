

	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { ExternalInterfaceController } from "../externalInterface/ExternalInterfaceController";
	import { JavascriptCallOnLoginCompleteFactory } from "../externalInterface/vo/JavascriptCallOnLoginCompleteFactory";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicSendClientLoginTrackingCommand extends SimpleCommand
	{
		constructor(){
			super( true );
		}

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var env:IEnvironmentGlobals = (<IEnvironmentGlobals>commandVars );

			if (!env.isLocal)
			{
				// Call javascript function "ggsLoginComplete"
				ExternalInterfaceController.instance.executeJavaScriptFunction( new JavascriptCallOnLoginCompleteFactory() );
			}
		}
	}

