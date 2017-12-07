

	import { BasicController } from "../BasicController";
	import { BasicDialogHandler } from "../../model/components/BasicDialogHandler";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicReconnectCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			BasicDialogHandler.getInstance().destroy();
			BasicController.getInstance().paymentHash = null;
		}
	}

