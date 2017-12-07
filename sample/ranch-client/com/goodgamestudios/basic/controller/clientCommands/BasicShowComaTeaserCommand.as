package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.commands.CMTCommand;
	import com.goodgamestudios.basic.model.components.BasicDialogHandler;
	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.basic.view.CommonDialogNames;
	import com.goodgamestudios.basic.view.dialogs.BasicStandardOkDialogProperties;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicShowComaTeaserCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var typeID:int = commandVars[ 0 ];
//			var textID:int = commandVars[ 1 ];
			var txtTitle:String = commandVars[ 2 ];
			var txtCopy:String = commandVars[ 3 ];

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
}
