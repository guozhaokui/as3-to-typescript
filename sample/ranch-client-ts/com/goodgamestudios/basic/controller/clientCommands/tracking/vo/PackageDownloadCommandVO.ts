/**
 * Created with IntelliJ IDEA.
 * User: nzamuruev
 * Date: 20.09.13
 * Time: 18:51
 * To change this template use File | Settings | File Templates.
 */


	export class PackageDownloadCommandVO
	{
		public downloadDuration:number;
		public downloadSize:number;
		public downloadURL:string;

		constructor( downloadDuration:number, downloadSize:number, downloadURL:string ){
			this.downloadDuration = downloadDuration;
			this.downloadSize = downloadSize;
			this.downloadURL = downloadURL;
		}
	}

