

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { BasicController } from "../BasicController";
	import { BasicPaymentShopClickTrackingVO } from "./tracking/vo/BasicPaymentShopClickTrackingVO";
	import { AddExtraCurrencyVO } from "./vo/AddExtraCurrencyVO";
	import { PathProvider } from "../../environment/providers/PathProvider";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommandController } from "../../../commanding/CommandController";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { debug } from "../../../logging/debug";
	import { error } from "../../../logging/error";
	import { BrowserUtil } from "../../../utils/BrowserUtil";
	import { ScreenShotConverter } from "../../../utils/ScreenShotConverter";

	import BitmapData = createjs.BitmapData;
	import Stage = createjs.Stage;
	import ExternalInterface = createjs.ExternalInterface;
	import BlurFilter = createjs.BlurFilter;
	import URLRequest = createjs.URLRequest;
	import URLVariables = createjs.URLVariables;

	export class BasicAddExtraCurrencyCommand extends SimpleCommand
	{
		protected paymentHash:string;
		protected sessionId:number;
		protected useFakeInGameShop:boolean;
		protected gameStage:Stage;

		/*override*/ public execute( commandVars:Object = null ):void
		{
			// We need to be sure, that user is logged in the game
			if (!BasicModel.sessionData.loggedIn)
			{
				return;
			}

			// sessionId is used as a shop-key in the link and tracked in GamePaymentShopClickEvent.
			// aka clientTime
			// aka shopId
			this.sessionId = this.currentUnixTime;

			var currentHash:string;
			var clickSourceId:number = 0;
			var shopTab:number = 0;

			// To be sure, that new "Tracking of the shop click source" feature don't break any shop functionality of the legacy games,
			// AddExtraCurrency command can be use with a paymentHash (as earlier).
			if (!commandVars)
			{
				currentHash = "";
			}
			else if (commandVars instanceof AddExtraCurrencyVO)
			{
				var addExtraCurrencyVO:AddExtraCurrencyVO = (<AddExtraCurrencyVO>commandVars );

				currentHash = addExtraCurrencyVO.paymentHash;
				clickSourceId = addExtraCurrencyVO.clickSourceId;
				shopTab = addExtraCurrencyVO.shopTab;
			}
			else
			{
				currentHash = commandVars.toString();
			}

			this.paymentHash = currentHash;

			// GamePaymentShopClickEvent fires, if user clicks on the shop-button.
			CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_GAME_PAYMENT_SHOP_CLICK_EVENT, new BasicPaymentShopClickTrackingVO( this.sessionId, clickSourceId ) );

			this.layoutManager.revertFullscreen();

			debug( "Use shop in Social Network? " + this.env.requestPayByJS );

			//use Shop in SocialNetwork
			if (this.env.requestPayByJS)
			{
				this.onOpenPaymentByJS();
			}
			else //use WWW Shop
			{
				/* generating single hash format coming from shop and server */
				var urlRequest:URLRequest = new URLRequest( PathProvider.instance.shopURL + this.paymentHash );
				var urlVariables:URLVariables = new URLVariables();

				urlVariables.sid = this.sessionId;

				if (shopTab > 0)
				{
					urlVariables.t = shopTab;
				}

				urlRequest.data = urlVariables;

				debug( "Use fake in game shop? " + this.useFakeInGameShop );

				if (this.canOpenFakeIngameShop())
				{
					if (EnvGlobalsHandler.globals.flashVars.inGameShop && this.gameStage)
					{
						this.onOpenFakeInGameShop( urlRequest, this.gameStage );
					}
					else
					{
						error( "Game wants to use inGameShop but the flashVar is not set or the gameStage is not provided" );
						this.onOpenPayment( urlRequest );
					}
				}
				else
				{
					this.onOpenPayment( urlRequest );
				}
			}
		}

		protected onOpenPaymentByJS():void
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
		protected onOpenPayment( urlRequest:URLRequest ):void
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

		private canOpenFakeIngameShop():boolean // new BF function
		{
			var clientRequirementsGiven:boolean = EnvGlobalsHandler.globals.flashVars.inGameShop && this.gameStage;
			return clientRequirementsGiven && ExternalInterface.available && ExternalInterface.call( "ggsCanOpenIngameShop" );
		}

		protected onOpenFakeInGameShop( urlRequest:URLRequest, stage:Stage ):void
		{
			var bmd:BitmapData = new BitmapData( stage.stageWidth, stage.stageHeight );
			bmd.draw( stage );

			var jpgStr:string = "data:image/png;base64," + ScreenShotConverter.scaledBmdToBase64Jpeg( bmd, .10, 100, [new BlurFilter( 2, 2, 3 )] );
			var url:string = BrowserUtil.getURLWithVariables( urlRequest );

			ExternalInterface.call( "ggsOpenIngameShop", url, jpgStr );
		}

		// TODO: Isn't there a global util class for retrieving the unix time?
		private get currentUnixTime():number
		{
			var dateStamp:Date = new Date();
			return Date.UTC( dateStamp.getUTCFullYear(), dateStamp.getUTCMonth(), dateStamp.getUTCDate(), dateStamp.getUTCHours(), dateStamp.getUTCMinutes(), dateStamp.getUTCSeconds(), dateStamp.getUTCMilliseconds() ).valueOf();
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

