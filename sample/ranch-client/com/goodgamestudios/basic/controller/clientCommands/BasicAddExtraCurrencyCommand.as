package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.basic.controller.BasicController;
	import com.goodgamestudios.basic.controller.clientCommands.tracking.vo.BasicPaymentShopClickTrackingVO;
	import com.goodgamestudios.basic.controller.clientCommands.vo.AddExtraCurrencyVO;
	import com.goodgamestudios.basic.environment.providers.PathProvider;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.commanding.CommandController;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.debug;
	import com.goodgamestudios.logging.error;
	import com.goodgamestudios.utils.BrowserUtil;
	import com.goodgamestudios.utils.ScreenShotConverter;

	import flash.display.BitmapData;
	import flash.display.Stage;
	import flash.external.ExternalInterface;
	import flash.filters.BlurFilter;
	import flash.net.URLRequest;
	import flash.net.URLVariables;

	public class BasicAddExtraCurrencyCommand extends SimpleCommand
	{
		protected var paymentHash:String;
		protected var sessionId:Number;
		protected var useFakeInGameShop:Boolean;
		protected var gameStage:Stage;

		override public function execute( commandVars:Object = null ):void
		{
			// We need to be sure, that user is logged in the game
			if (!BasicModel.sessionData.loggedIn)
			{
				return;
			}

			// sessionId is used as a shop-key in the link and tracked in GamePaymentShopClickEvent.
			// aka clientTime
			// aka shopId
			sessionId = currentUnixTime;

			var currentHash:String;
			var clickSourceId:int = 0;
			var shopTab:int = 0;

			// To be sure, that new "Tracking of the shop click source" feature don't break any shop functionality of the legacy games,
			// AddExtraCurrency command can be use with a paymentHash (as earlier).
			if (!commandVars)
			{
				currentHash = "";
			}
			else if (commandVars is AddExtraCurrencyVO)
			{
				var addExtraCurrencyVO:AddExtraCurrencyVO = commandVars as AddExtraCurrencyVO;

				currentHash = addExtraCurrencyVO.paymentHash;
				clickSourceId = addExtraCurrencyVO.clickSourceId;
				shopTab = addExtraCurrencyVO.shopTab;
			}
			else
			{
				currentHash = commandVars.toString();
			}

			paymentHash = currentHash;

			// GamePaymentShopClickEvent fires, if user clicks on the shop-button.
			CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_GAME_PAYMENT_SHOP_CLICK_EVENT, new BasicPaymentShopClickTrackingVO( sessionId, clickSourceId ) );

			layoutManager.revertFullscreen();

			debug( "Use shop in Social Network? " + env.requestPayByJS );

			//use Shop in SocialNetwork
			if (env.requestPayByJS)
			{
				onOpenPaymentByJS();
			}
			else //use WWW Shop
			{
				/* generating single hash format coming from shop and server */
				var urlRequest:URLRequest = new URLRequest( PathProvider.instance.shopURL + paymentHash );
				var urlVariables:URLVariables = new URLVariables();

				urlVariables.sid = sessionId;

				if (shopTab > 0)
				{
					urlVariables.t = shopTab;
				}

				urlRequest.data = urlVariables;

				debug( "Use fake in game shop? " + useFakeInGameShop );

				if (canOpenFakeIngameShop())
				{
					if (EnvGlobalsHandler.globals.flashVars.inGameShop && gameStage)
					{
						onOpenFakeInGameShop( urlRequest, gameStage );
					}
					else
					{
						error( "Game wants to use inGameShop but the flashVar is not set or the gameStage is not provided" );
						onOpenPayment( urlRequest );
					}
				}
				else
				{
					onOpenPayment( urlRequest );
				}
			}
		}

		protected function onOpenPaymentByJS():void
		{
			if (!ExternalInterface.available)
			{
				return;
			}

			try
			{
				ExternalInterface.call( "requestPayment" );
			}
			catch (error:SecurityError)
			{
				throw new Error( "external interface not available" );
			}
		}

		/**
		 *    open Paymentshop
		 */
		protected function onOpenPayment( urlRequest:URLRequest ):void
		{
			try
			{
				BrowserUtil.openWindow( urlRequest );
			}
			catch (e:Error)
			{
				throw new Error( "navigateToURL error" );
			}
		}

		private function canOpenFakeIngameShop():Boolean // new BF function
		{
			var clientRequirementsGiven:Boolean = EnvGlobalsHandler.globals.flashVars.inGameShop && gameStage;
			return clientRequirementsGiven && ExternalInterface.available && ExternalInterface.call( "ggsCanOpenIngameShop" );
		}

		protected function onOpenFakeInGameShop( urlRequest:URLRequest, stage:Stage ):void
		{
			var bmd:BitmapData = new BitmapData( stage.stageWidth, stage.stageHeight );
			bmd.draw( stage );

			var jpgStr:String = "data:image/png;base64," + ScreenShotConverter.scaledBmdToBase64Jpeg( bmd, .10, 100, [new BlurFilter( 2, 2, 3 )] );
			var url:String = BrowserUtil.getURLWithVariables( urlRequest );

			ExternalInterface.call( "ggsOpenIngameShop", url, jpgStr );
		}

		// TODO: Isn't there a global util class for retrieving the unix time?
		private function get currentUnixTime():Number
		{
			var dateStamp:Date = new Date();
			return Date.UTC( dateStamp.getUTCFullYear(), dateStamp.getUTCMonth(), dateStamp.getUTCDate(), dateStamp.getUTCHours(), dateStamp.getUTCMinutes(), dateStamp.getUTCSeconds(), dateStamp.getUTCMilliseconds() ).valueOf();
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
