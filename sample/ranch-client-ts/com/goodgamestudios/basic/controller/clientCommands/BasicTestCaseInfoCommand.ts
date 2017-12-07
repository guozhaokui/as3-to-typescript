/**
 * Created by vvurilla on 13.08.2014.
 */


	import { BasicSmartfoxConstants } from "../BasicSmartfoxConstants";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { warn } from "../../../logging/warn";

	export class BasicTestCaseInfoCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (!commandVars)
			{
				warn( "Can't request TestCaseInfo without a testCaseID" );
				return;
			}

			var testCaseID:number = commandVars[ 0 ];
			BasicModel.smartfoxClient.sendMessage( BasicSmartfoxConstants.C2S_TEST_CASE_INFO, [testCaseID] );
		}
	}

