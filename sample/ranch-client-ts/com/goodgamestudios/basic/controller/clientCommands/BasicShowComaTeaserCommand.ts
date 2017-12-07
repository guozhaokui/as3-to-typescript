

	import { CMTCommand } from "../commands/CMTCommand";
	import { BasicDialogHandler } from "../../model/components/BasicDialogHandler";
	import { BasicLayoutManager } from "../../view/BasicLayoutManager";
	import { CommonDialogNames } from "../../view/CommonDialogNames";
	import { BasicStandardOkDialogProperties } from "../../view/dialogs/BasicStandardOkDialogProperties";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";

	export class BasicShowComaTeaserCommand extends SimpleCommand
	{
		/*override*/ public execute( commandVars:Object = null ):void
		{
			var typeID:number = commandVars[ 0 ];
//			var textID:int = commandVars[ 1 ];
			var txtTitle:string = commandVars[ 2 ];
			var txtCopy:string = commandVars[ 3 ];

			// is teaser a warning?
			if (typeID == CMTCommand.TEASERTYPE_WARNING)
			{
				// show instantly
				BasicLayoutManager.getInstance().showAdminDialog( CommonDialogNames.StandardOkDialog_NAME, new BasicStandardOkDialogProperties( txtTitle, txtCopy ) );
			}
			else
			{
				// show via dialog handler if logged in
				if (BasicLayoutManager.gameState == BasicLayoutManager.STATE_LOGIN)
				{
					BasicDialogHandler.getInstance().registerDialogs( CommonDialogNames.StandardOkDialog_NAME, new BasicStandardOkDialogProperties( txtTitle, txtCopy ) );
				}
				else
				{
					BasicLayoutManager.getInstance().showAdminDialog( CommonDialogNames.StandardOkDialog_NAME, new BasicStandardOkDialogProperties( txtTitle, txtCopy ) );
				}
			}
		}
	}

