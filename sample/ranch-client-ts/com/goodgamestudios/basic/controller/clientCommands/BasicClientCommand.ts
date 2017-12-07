

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { IEnvironmentGlobals } from "../../IEnvironmentGlobals";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicClientCommand extends SimpleCommand
	{
		constructor( singleExecution:boolean = false ){
			super( singleExecution );
		}

		protected get env():IEnvironmentGlobals
		{
			return EnvGlobalsHandler.globals;
		}
	}

