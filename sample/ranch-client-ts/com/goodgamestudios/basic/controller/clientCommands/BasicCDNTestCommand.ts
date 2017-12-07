/**
 * Created with IntelliJ IDEA.
 * User: dkoehler
 * Date: 24.08.12
 * Time: 13:20
 * To change this template use File | Settings | File Templates.
 */


	import { BulkLoader } from "../../../../../br/com/stimuli/loading/BulkLoader";
	import { LoadingItem } from "../../../../../br/com/stimuli/loading/loadingtypes/LoadingItem";

	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { error } from "../../../logging/error";

	import ErrorEvent = createjs.ErrorEvent;
	import Event = createjs.Event;

	export class BasicCDNTestCommand extends SimpleCommand
	{
		private FIRST_DNS_DOMAIN:string = "http://ak.goodgamecdn1.com/cdnTestFile.jpg";
		private SECOND_DNS_DOMAIN:string = "http://cl.goodgamecdn1.com/cdnTestFile.jpg";
		private THIRD_DNS_DOMAIN:string = "http://ll.goodgamecdn1.com/cdnTestFile.jpg";

		private NUMBER_OF_DOMAINS:number = 3;

		private envGlobals:IEnvironmentGlobals;
		private cdnLoader:BulkLoader = new BulkLoader( "cdnLoader", 1 );

		/*override*/ public execute( commandVars:Object = null ):void
		{
			if (commandVars)
			{
				this.envGlobals = (<IEnvironmentGlobals>commandVars );
				if ((this.envGlobals.isFirstVisitOfGGS || this.envGlobals.userFromLandingPage) && (!this.envGlobals.isLocal))
				{
					var testCase:string = "";
					var indexNumber:number = Math.floor( Math.random() * this.NUMBER_OF_DOMAINS + 1 );

					if (indexNumber == 1)
					{
						testCase = this.FIRST_DNS_DOMAIN;
					}
					else if (indexNumber == 2)
					{
						testCase = this.SECOND_DNS_DOMAIN;
					}
					else if (indexNumber == 3)
					{
						testCase = this.THIRD_DNS_DOMAIN;
					}

					if (testCase)
					{
						this.loadCDNTest( testCase );
						this.cdnLoader.start();
					}
				}
			}
		}

		private loadCDNTest( url:string ):void
		{
			this.cdnLoader.add( url, {id: url} );
			this.cdnLoader.addEventListener( ErrorEvent.ERROR, this.errorHandler );
			var loadingItem:LoadingItem = this.cdnLoader.get( url );
			loadingItem.addEventListener( Event.COMPLETE, this.sendTrackingEvent );
		}

		private errorHandler( event:ErrorEvent ):void
		{
			this.removeListeners();

			var testPictureUrl:string = event.target.items[0].url.url;
			error( "Our test-picture ( located at " + testPictureUrl + " ) exists no longer!" );
		}

		private sendTrackingEvent( e:Event ):void
		{
			this.removeListeners();

			var loadingItem:LoadingItem = (<LoadingItem>e.currentTarget );
			loadingItem.removeEventListener( Event.COMPLETE, this.sendTrackingEvent );
			var loadingTime:number = loadingItem.totalTime - loadingItem.responseTime;

			// Command commented out, because constant was removed from the basicController.
			// This class stays in Core and can be used in the future.
			//CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_PACKAGE_DOWNLOAD_EVENT, new PackageDownloadCommandVO( loadingTime, loadingItem.bytesTotal, loadingItem.id ) );
		}

		private removeListeners():void
		{
			this.cdnLoader.removeEventListener( ErrorEvent.ERROR, this.errorHandler );
			this.cdnLoader.removeEventListener( Event.COMPLETE, this.sendTrackingEvent );
		}
	}

