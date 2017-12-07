

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { BasicController } from "../BasicController";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommonDialogNames } from "../../view/CommonDialogNames";
	import { BasicStandardYesNoDialogProperties } from "../../view/dialogs/BasicStandardYesNoDialogProperties";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { Localize } from "../../../core/localization/utils/Localize";

	/**
	 *    BasicOnClickMoreCurrencyCommand
	 *
	 *     @author Alexander
	 */

	export class BasicOnClickMoreCurrencyCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (BasicModel.userData.isGuest())
			{
				this.layoutManager.showDialog( CommonDialogNames.StandardYesNoDialog_NAME, new BasicStandardYesNoDialogProperties( Localize.text( "alert_addgold_title" ), Localize.text( "alert_addgold_copy" ), this.onStartRegisterDialog, null, null, Localize.text( "panelwin_login_register" ), Localize.text( "btn_text_cancle" ) ) );
			}
			else
			{
				this.addExtraGold();
			}
		}

		/**
		 *     open Paymentshop
		 */
		private addExtraGold():void
		{
			BasicController.getInstance().addExtraGold();
		}

		/**
		 *     show RegisterDialog
		 */
		private onStartRegisterDialog( param:any[] ):void
		{
			BasicController.getInstance().onStartRegisterDialog();
		}

		protected get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}

	}

