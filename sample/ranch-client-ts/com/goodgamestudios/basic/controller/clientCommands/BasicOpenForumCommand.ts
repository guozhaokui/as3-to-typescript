

	import { EnvGlobalsHandler } from "../../EnvGlobalsHandler";
	import { ExternalInterfaceController } from "../externalInterface/ExternalInterfaceController";
	import { JavascriptFunctionName } from "../externalInterface/JavascriptFunctionName";
	import { BasicModel } from "../../model/BasicModel";
	import { SimpleCommand } from "../../../commanding/SimpleCommand";
	import { BrowserUtil } from "../../../utils/BrowserUtil";

	import URLRequest = createjs.URLRequest;

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
	export class BasicOpenForumCommand extends SimpleCommand
	{
		/*override*/ public /*final*/ execute( commandVars:Object = null ):void
		{
			// Request group via Javascript
			if (EnvGlobalsHandler.globals.networkNewsByJS)
			{
				this.goGroup();
			}
			// Request default forum link
			else
			{
				// If links are allowed in this network
				if (EnvGlobalsHandler.globals.useexternallinks)
				{
					this.goForum();
				}
			}
		}

		private goForum():void
		{
			var forumURL:string;

			// Forum root
			forumURL = BasicModel.forumData.getForumRootURL();

			var request:URLRequest = new URLRequest( forumURL );
			BrowserUtil.executeNavigateToURL( request, "_blank" );
		}

		private goGroup():void
		{
			ExternalInterfaceController.instance.executeJavaScriptFunction( JavascriptFunctionName.REQUEST_GROUP );
		}
	}
