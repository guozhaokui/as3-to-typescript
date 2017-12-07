/**
 * Copyright © 2012 Goodgame Studios. All rights reserved.
 *
 * Created with IntelliJ IDEA
 * Creator: pburst
 * Created: 19.08.13, 17:10
 *
 * $URL: $
 * $Rev: $
 * $Author: $
 * $Date: $
 * $Id: $
 */


	export class ServerErrorVO
	{
		public error:number;
		public params:any[];
		public commandId:string;

		constructor( error:number, params:any[], commandId:string = "" ){
			this.error = error;
			this.params = params;
			this.commandId = commandId;
		}
	}
