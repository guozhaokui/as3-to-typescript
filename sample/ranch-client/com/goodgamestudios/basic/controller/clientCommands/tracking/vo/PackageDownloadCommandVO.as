/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:51
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking.vo
{

	public class PackageDownloadCommandVO
	{
		public var downloadDuration:Number;
		public var downloadSize:Number;
		public var downloadURL:String;

		public function PackageDownloadCommandVO( downloadDuration:Number, downloadSize:Number, downloadURL:String )
		{
			this.downloadDuration = downloadDuration;
			this.downloadSize = downloadSize;
			this.downloadURL = downloadURL;
		}
	}
}
