package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.view.BasicLayoutManager;
	import com.goodgamestudios.basic.view.CommonDialogNames;
	import com.goodgamestudios.basic.view.dialogs.BasicRegisterDialogProperties;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicShowRegisterDialogCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			layoutManager.showDialog( CommonDialogNames.RegisterDialog_NAME, new BasicRegisterDialogProperties() );
		}

		private function get layoutManager():BasicLayoutManager
		{
			return BasicLayoutManager.getInstance();
		}
	}
}
