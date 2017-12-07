package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.components.BasicDialogHandler;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.textfield.manager.GoodgameTextFieldManager;

	public class BasicDestroyGameCommand extends SimpleCommand
	{
		override final public function execute( commandVars:Object = null ):void
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

			destroyGameSpecificObjects();
		}

		/**
		 * Hook method for disposing game specific lists and listeners
		 */
		protected function destroyGameSpecificObjects():void
		{
			// override
		}
	}
}
