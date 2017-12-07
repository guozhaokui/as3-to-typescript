

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicController } from "../BasicController";
	import { BasicDialogHandler } from "../../model/components/BasicDialogHandler";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { GoodgameTextFieldManager } from "../../../textfield/manager/GoodgameTextFieldManager";

	export class BasicDestroyGameCommand extends SimpleCommand
	{
		/*override*/ /*final*/ public execute( commandVars:Object = null ):void
		{
			BasicController.getInstance().onDestroyGame();

			// Clear GUI
			BasicLayoutManager.getInstance().clearAllLayoutContent();

			// Dialogs
			BasicDialogHandler.getInstance().destroy();

			// Reset GoodgameTextFieldManager
			if (!EnvGlobalsHandler.globals.useLegacyFontManagement)
			{
				GoodgameTextFieldManager.getInstance().unregisterAllTextFields();
			}

			this.destroyGameSpecificObjects();
		}

		/**
		 * Hook method for disposing game specific lists and listeners
		 */
		protected destroyGameSpecificObjects():void
		{
			// override
		}
	}

