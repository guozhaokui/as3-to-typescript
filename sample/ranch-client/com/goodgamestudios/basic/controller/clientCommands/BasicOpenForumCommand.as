package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.controller.externalInterface.ExternalInterfaceController;
	import com.goodgamestudios.basic.controller.externalInterface.JavascriptFunctionName;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.utils.BrowserUtil;

	import flash.net.URLRequest;

	/**
	 * <p>Opens the forum or a group (depending on the network settings).
	 * You my configure a specific sub forum with a ForumLinkVO. URL will be composed automatically</p>
	 *
	 * Open forum:
	 * <code>CommandController.instance.executeCommand(BasicController.COMMAND_OPEN_FORUM);</code>
	 *
	 * Open sub forum (with the help of a ForumLinkVO):
	 * <code>CommandController.instance.executeCommand(BasicController.COMMAND_OPEN_FORUM,new ForumLinkVO(Constants_URL.FORUM_ID_ANNOUNCEMENT));</code>
	 */
	public class BasicOpenForumCommand extends SimpleCommand
	{
		override public final function execute( commandVars:Object = null ):void
		{
			// Request group via Javascript
			if (EnvGlobalsHandler.globals.networkNewsByJS)
			{
				goGroup();
			}
			// Request default forum link
			else
			{
				// If links are allowed in this network
				if (EnvGlobalsHandler.globals.useexternallinks)
				{
					goForum();
				}
			}
		}

		private function goForum():void
		{
			var forumURL:String;

			// Forum root
			forumURL = BasicModel.forumData.getForumRootURL();

			var request:URLRequest = new URLRequest( forumURL );
			BrowserUtil.executeNavigateToURL( request, "_blank" );
		}

		private function goGroup():void
		{
			ExternalInterfaceController.instance.executeJavaScriptFunction( JavascriptFunctionName.REQUEST_GROUP );
		}
	}
}