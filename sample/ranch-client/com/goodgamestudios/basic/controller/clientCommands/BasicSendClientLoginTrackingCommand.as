package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.externalInterface.ExternalInterfaceController;
	import com.goodgamestudios.basic.controller.externalInterface.vo.JavascriptCallOnLoginCompleteFactory;
	import com.goodgamestudios.commanding.SimpleCommand;

	public final class BasicSendClientLoginTrackingCommand extends SimpleCommand
	{
		public function BasicSendClientLoginTrackingCommand()
		{
			super( true );
		}

		override public function execute( commandVars:Object = null ):void
		{
			var env:IEnvironmentGlobals = commandVars as IEnvironmentGlobals;

			if (!env.isLocal)
			{
				// Call javascript function "ggsLoginComplete"
				ExternalInterfaceController.instance.executeJavaScriptFunction( new JavascriptCallOnLoginCompleteFactory() );
			}
		}
	}
}
