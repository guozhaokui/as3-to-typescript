/**
 * Created by tschrader on 01.07.2016.
 */
package com.goodgamestudios.ranch.world.utils
{

	import flash.utils.Dictionary;
	import flash.utils.getTimer;

	public class AssetCacheCleaner
	{

		private var _assetDict:Dictionary = new Dictionary(); // [key] = timestamp

		public function cleanOldAssets():void
		{
			delete _assetDict[ toRemove[i] ];
			delete _assetDict[ toRemove[ i ] ];
			_assetDict[ toRemove[i] ] = 4;
			_assetDict[ toRemove[i] ] = something[ 6 ];
		}


	}
}
