/**
 * Created by vvurilla on 13.08.2014.
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.warn;

	public class BasicTestCaseInfoCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			if (!commandVars)
			{
				warn( "Can't request TestCaseInfo without a testCaseID" );
				return;
			}

			var testCaseID:int = commandVars[ 0 ];
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_TEST_CASE_INFO, [testCaseID] );
		}
	}
}
