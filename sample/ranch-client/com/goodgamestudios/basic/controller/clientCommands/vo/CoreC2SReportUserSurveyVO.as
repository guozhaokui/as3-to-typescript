/**
 * Created by fjansen on 10/13/2014.
 */
package com.goodgamestudios.basic.controller.clientCommands.vo
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.controller.commands.BasicCommandVO;

	/**
	 * The ReportUserSurveyEvent is an event to report the results of a survey to the server. The server then stores the
	 * results with additional server side data on the game tracking server.
	 *
	 * @see https://sites.google.com/a/goodgamestudios.com/tech-wiki/java/gamedocumentation/core/events/reportusersurveyevent
	 */
	public class CoreC2SReportUserSurveyVO extends BasicCommandVO
	{
		/**
		 * Time to complete survey in seconds
		 */
		public var ttc:int;

		/**
		 * Clicks on "submit" to complete survey (indicative of trying to submit the survey without filling it out completely)
		 */
		public var ctc:int;

		/**
		 * isLazy 0 or 1, check if actual level fits Level category. (It's an indicator that the user just submitted the
		 * survey without caring to give meaningful answers - this way, Data Analysis can just ignore those answers.
		 */
		public var il:int;

		/**
		 * isCanceled 0 or 1, if the dialog was closed instead of submitted
		 */
		public var ic:int;

		/**
		 * Answers JSONObject that maps the question to the answer
		 * e.g. {"q1":[0,2,4], "q2":[1], "q3":[], "q4": "Foo"}
		 */
		public var a:Object;

		override public function getCmdId():String
		{
			return BasicSmartfoxConstants.C2S_REPORT_USER_SURVEY;
		}

		public function CoreC2SReportUserSurveyVO( timeToComplete:int, clicksToComplete:int, isLazy:int, isCanceled:int, answers:Object )
		{
			this.ttc = timeToComplete;
			this.ctc = clicksToComplete;
			this.il = isLazy;
			this.ic = isCanceled;
			this.a = answers;
		}
	}
}
