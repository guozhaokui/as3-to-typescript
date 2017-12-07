/**
 * Created with IntelliJ IDEA.
 * User: dkoehler
 * Date: 24.08.12
 * Time: 13:20
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import br.com.stimuli.loading.BulkLoader;
	import br.com.stimuli.loading.loadingtypes.LoadingItem;

	import com.goodgamestudios.basic.IEnvironmentGlobals;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.logging.error;

	import flash.events.ErrorEvent;
	import flash.events.Event;

	public class BasicCDNTestCommand extends SimpleCommand
	{
		private const FIRST_DNS_DOMAIN:String = "http://ak.goodgamecdn1.com/cdnTestFile.jpg";
		private const SECOND_DNS_DOMAIN:String = "http://cl.goodgamecdn1.com/cdnTestFile.jpg";
		private const THIRD_DNS_DOMAIN:String = "http://ll.goodgamecdn1.com/cdnTestFile.jpg";

		private const NUMBER_OF_DOMAINS:int = 3;

		private var envGlobals:IEnvironmentGlobals;
		private var cdnLoader:BulkLoader = new BulkLoader( "cdnLoader", 1 );

		override public function execute( commandVars:Object = null ):void
		{
			if (commandVars)
			{
				envGlobals = commandVars as IEnvironmentGlobals;
				if ((envGlobals.isFirstVisitOfGGS || envGlobals.userFromLandingPage) && (!envGlobals.isLocal))
				{
					var testCase:String = "";
					var indexNumber:int = Math.floor( Math.random() * NUMBER_OF_DOMAINS + 1 );

					if (indexNumber == 1)
					{
						testCase = FIRST_DNS_DOMAIN;
					}
					else if (indexNumber == 2)
					{
						testCase = SECOND_DNS_DOMAIN;
					}
					else if (indexNumber == 3)
					{
						testCase = THIRD_DNS_DOMAIN;
					}

					if (testCase)
					{
						loadCDNTest( testCase );
						cdnLoader.start();
					}
				}
			}
		}

		private function loadCDNTest( url:String ):void
		{
			cdnLoader.add( url, {id: url} );
			cdnLoader.addEventListener( ErrorEvent.ERROR, errorHandler );
			var loadingItem:LoadingItem = cdnLoader.get( url );
			loadingItem.addEventListener( Event.COMPLETE, sendTrackingEvent );
		}

		private function errorHandler( event:ErrorEvent ):void
		{
			removeListeners();

			var testPictureUrl:String = event.target.items[0].url.url;
			error( "Our test-picture ( located at " + testPictureUrl + " ) exists no longer!" );
		}

		private function sendTrackingEvent( e:Event ):void
		{
			removeListeners();

			var loadingItem:LoadingItem = e.currentTarget as LoadingItem;
			loadingItem.removeEventListener( Event.COMPLETE, sendTrackingEvent );
			var loadingTime:Number = loadingItem.totalTime - loadingItem.responseTime;

			// Command commented out, because constant was removed from the basicController.
			// This class stays in Core and can be used in the future.
			//CommandController.instance.executeCommand( BasicController.COMMAND_TRACK_PACKAGE_DOWNLOAD_EVENT, new PackageDownloadCommandVO( loadingTime, loadingItem.bytesTotal, loadingItem.id ) );
		}

		private function removeListeners():void
		{
			cdnLoader.removeEventListener( ErrorEvent.ERROR, errorHandler );
			cdnLoader.removeEventListener( Event.COMPLETE, sendTrackingEvent );
		}
	}
}
