/**
 * Created with IntelliJ IDEA.
 * User: aprzybyszewski
 * Date: 12.06.13
 * Time: 14:08
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { BasicController } from "../BasicController";
	import { IdentityManagementEvent } from "../../event/IdentityManagementEvent";
	import { BasicModel } from "../../model/BasicModel";
	import { BasicIdentityManagementData } from "../../model/components/BasicIdentityManagementData";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	/**
	 * This command will get called when a login attempt fails due
	 * to missing Siren24 age check data on server-side.
	 *
	 * The BasicIdentityManagementData class will handle our callback
	 * mechanism in order to re-trigger login after the age check is
	 * completed on the JS side.
	 */
	export class BasicIdentityManagementCommand extends SimpleCommand
	{
		public static NAME:string = "BasicIdentityManagementCommand";

		constructor( singleExecution:boolean = false ){
			super( singleExecution );
		}

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var isIdentityManagementActive:boolean = (<Boolean>commandVars );

			EnvGlobalsHandler.globals.isIdentityManagementActive = isIdentityManagementActive;

			trace( "[BasicIdentityManagementCommand] execute() -> isIdentityManagementActive: " + isIdentityManagementActive );

			// Activate identity management
			if (isIdentityManagementActive)
			{
				if (!BasicModel.identityManagement)
				{

					// Instantiate identity model
					BasicModel.identityManagement = new BasicIdentityManagementData();

					// Initialize:
					// Starts license refresher
					BasicModel.identityManagement.initialize();
				}

				// This guy will activate the in-game IdentityManagementView
				BasicController.getInstance().dispatchEvent( new IdentityManagementEvent( IdentityManagementEvent.ID_MANAGEMENT_ACTIVE ) );
			}
			// Deactivate identity management
			else
			{
				if (BasicModel.identityManagement)
				{
					// Dispose:
					// Stops license refresher
					// Removes Javascript callback from ID-Check HTML popup (if not already removed)
					BasicModel.identityManagement.dispose();
					BasicModel.identityManagement = null;
				}

				BasicController.getInstance().dispatchEvent( new IdentityManagementEvent( IdentityManagementEvent.ID_MANAGEMENT_INCTIVE ) );
			}
		}
	}
