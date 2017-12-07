package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.basic.view.CommonDialogNames;
	import com.goodgamestudios.basic.view.dialogs.BasicStandardYesNoDialogProperties;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.core.localization.utils.Localize;

	/**
	 *    BasicOnClickMoreCurrencyCommand
	 *
	 *     @author Alexander
	 */

	public class BasicOnClickMoreCurrencyCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			if (BasicModel.userData.isGuest())
			{
				layoutManager.showDialog( CommonDialogNames.StandardYesNoDialog_NAME, new BasicStandardYesNoDialogProperties( Localize.text( "alert_addgold_title" ), Localize.text( "alert_addgold_copy" ), onStartRegisterDialog, null, null, Localize.text( "panelwin_login_register" ), Localize.text( "btn_text_cancle" ) ) );
			}
			else
			{
				addExtraGold();
			}
		}

		/**
		 *     open Paymentshop
		 */
		private function addExtraGold():void
		{
			BasicController.getInstance().addExtraGold();
		}

		/**
		 *     show RegisterDialog
		 */
		private function onStartRegisterDialog( param:Array ):void
		{
			BasicController.getInstance().onStartRegisterDialog();
		}

		protected function get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}

		protected function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}

	}
}
