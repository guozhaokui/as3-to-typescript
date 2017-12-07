/**
 * Created by tschrader on 01.07.2016.
 */

	
	import getTimer = createjs.getTimer;

	export class AssetCacheCleaner
	{

		private _assetDict:Map<any, any> = new Map<any, any>(); // [key] = timestamp

		public cleanOldAssets():void
		{
			this._assetDict.delete(this.toRemove[this.i]);
			this._assetDict.delete(this.toRemove[ this.i ]);
			this._assetDict.set(this.toRemove[this.i], 4);
			this._assetDict.set(this.toRemove[this.i], this.something[ 6 ]);
		}


	}

