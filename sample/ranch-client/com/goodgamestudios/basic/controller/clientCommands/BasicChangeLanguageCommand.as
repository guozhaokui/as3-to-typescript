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
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.event.CountryInstanceMappingEvent;
	import com.goodgamestudios.basic.event.IdleScreenEvent;
	import com.goodgamestudios.basic.event.LanguageDataEvent;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicLanguageFontManager;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.textfield.manager.GoodgameTextFieldManager;

	public class BasicChangeLanguageCommand extends SimpleCommand
	{

		public static const NAME:String = "BasicChangeLanguageCommand";

		override public function execute( commandVars:Object = null ):void
		{
			info( ": load language XML" );

			if (BasicModel.languageData.hasEventListener( LanguageDataEvent.XML_LOAD_COMPLETE ))
			{
				BasicModel.languageData.removeEventListener( LanguageDataEvent.XML_LOAD_COMPLETE, onLanguageXMLComplete );
			}

			BasicModel.languageData.languageXMLLoaded = false;
			BasicModel.languageData.addEventListener( LanguageDataEvent.XML_LOAD_COMPLETE, onLanguageXMLComplete );
			BasicModel.languageData.loadLanguage();
		}

		private function onLanguageXMLComplete( event:LanguageDataEvent ):void
		{
			BasicModel.languageData.removeEventListener( LanguageDataEvent.XML_LOAD_COMPLETE, onLanguageXMLComplete );

			var fontManager:BasicLanguageFontManager = BasicLanguageFontManager.getInstance();

			// If app uses default font and the GoodgameTextField only the texts have to be updated
			if (fontManager.useDefaultFont && !env.useLegacyFontManagement)
			{
				info( ": onLanguageXMLComplete() -> Using default font, update texts" );

				// Just update texts
				GoodgameTextFieldManager.getInstance().updateTextInAllTextFields();

				// TODO: This is needed for some legacy functionality. Remove this line when the GoodgameTextField
				// is ready for arabic
				BasicLanguageFontManager.getInstance().dispatchEvent( new LanguageDataEvent( LanguageDataEvent.FONT_LOAD_COMPLETE ) );

				onChangeLanguageComplete();

				// No font have to be loaded, bail out
				return;
			}

			fontManager.addEventListener( LanguageDataEvent.FONT_LOAD_COMPLETE, onFontLoadComplete );

			info( ": onLanguageXMLComplete() -> Load font SWF" );
			// Initialize font or load font if necessary
			fontManager.initFontSwf();
		}

		private function onChangeLanguageComplete():void
		{
			BasicController.getInstance().dispatchEvent( new IdleScreenEvent( IdleScreenEvent.HIDE ) );
			BasicController.getInstance().dispatchEvent( new CountryInstanceMappingEvent( CountryInstanceMappingEvent.PROCESS_COMPLETE ) );
			// Display versions
			BasicLayoutManager.getInstance().showServerAndClientVersion();
		}

		private function onFontLoadComplete( event:LanguageDataEvent ):void
		{
			var fontManager:BasicLanguageFontManager = BasicLanguageFontManager.getInstance();
			fontManager.removeEventListener( LanguageDataEvent.FONT_LOAD_COMPLETE, onFontLoadComplete );

			info( ": onFontLoadComplete()" );

			if (env.useLegacyFontManagement)
			{
				// App uses legacy font management system, nothing to do here
				return;
			}

			// Update texts
			GoodgameTextFieldManager.getInstance().updateTextInAllTextFields();

			onChangeLanguageComplete();
		}

		private function get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}
}
