/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 25.10.12, 12:31
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { BasicController } from "../BasicController";
	import { CountryInstanceMappingEvent } from "../../event/CountryInstanceMappingEvent";
	import { IdleScreenEvent } from "../../event/IdleScreenEvent";
	import { LanguageDataEvent } from "../../event/LanguageDataEvent";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicLanguageFontManager } from "../../view/BasicLanguageFontManager";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { info } from "../../../logging/info";
	import { GoodgameTextFieldManager } from "../../../textfield/manager/GoodgameTextFieldManager";

	export class BasicChangeLanguageCommand extends SimpleCommand
	{

		public static NAME:string = "BasicChangeLanguageCommand";

		/*override*/ public execute( commandVars:Object = null ):void
		{
			info( ": load language XML" );

			if (BasicModel.languageData.hasEventListener( LanguageDataEvent.XML_LOAD_COMPLETE ))
			{
				BasicModel.languageData.removeEventListener( LanguageDataEvent.XML_LOAD_COMPLETE, this.onLanguageXMLComplete );
			}

			BasicModel.languageData.languageXMLLoaded = false;
			BasicModel.languageData.addEventListener( LanguageDataEvent.XML_LOAD_COMPLETE, this.onLanguageXMLComplete );
			BasicModel.languageData.loadLanguage();
		}

		private onLanguageXMLComplete( event:LanguageDataEvent ):void
		{
			BasicModel.languageData.removeEventListener( LanguageDataEvent.XML_LOAD_COMPLETE, this.onLanguageXMLComplete );

			var fontManager:BasicLanguageFontManager = BasicLanguageFontManager.getInstance();

			// If app uses default font and the GoodgameTextField only the texts have to be updated
			if (fontManager.useDefaultFont && !this.env.useLegacyFontManagement)
			{
				info( ": onLanguageXMLComplete() -> Using default font, update texts" );

				// Just update texts
				GoodgameTextFieldManager.getInstance().updateTextInAllTextFields();

				// TODO: This is needed for some legacy functionality. Remove this line when the GoodgameTextField
				// is ready for arabic
				BasicLanguageFontManager.getInstance().dispatchEvent( new LanguageDataEvent( LanguageDataEvent.FONT_LOAD_COMPLETE ) );

				this.onChangeLanguageComplete();

				// No font have to be loaded, bail out
				return;
			}

			fontManager.addEventListener( LanguageDataEvent.FONT_LOAD_COMPLETE, this.onFontLoadComplete );

			info( ": onLanguageXMLComplete() -> Load font SWF" );
			// Initialize font or load font if necessary
			fontManager.initFontSwf();
		}

		private onChangeLanguageComplete():void
		{
			BasicController.getInstance().dispatchEvent( new IdleScreenEvent( IdleScreenEvent.HIDE ) );
			BasicController.getInstance().dispatchEvent( new CountryInstanceMappingEvent( CountryInstanceMappingEvent.PROCESS_COMPLETE ) );
			// Display versions
			BasicLayoutManager.getInstance().showServerAndClientVersion();
		}

		private onFontLoadComplete( event:LanguageDataEvent ):void
		{
			var fontManager:BasicLanguageFontManager = BasicLanguageFontManager.getInstance();
			fontManager.removeEventListener( LanguageDataEvent.FONT_LOAD_COMPLETE, this.onFontLoadComplete );

			info( ": onFontLoadComplete()" );

			if (this.env.useLegacyFontManagement)
			{
				// App uses legacy font management system, nothing to do here
				return;
			}

			// Update texts
			GoodgameTextFieldManager.getInstance().updateTextInAllTextFields();

			this.onChangeLanguageComplete();
		}

		private get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

