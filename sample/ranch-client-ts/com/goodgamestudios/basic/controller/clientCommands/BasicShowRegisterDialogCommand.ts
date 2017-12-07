

	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommonDialogNames } from "../../view/CommonDialogNames";
	import { BasicRegisterDialogProperties } from "../../view/dialogs/BasicRegisterDialogProperties";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicShowRegisterDialogCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			this.layoutManager.showDialog( CommonDialogNames.RegisterDialog_NAME, new BasicRegisterDialogProperties() );
		}

		private get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}
	}

