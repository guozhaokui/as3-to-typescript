/**
 * Created by fjansen on 10/13/2014.
 */


	import { BasicSmartfoxConstants } from "../../BasicSmartfoxConstants";
	import { BasicCommandVO } from "../../commands/BasicCommandVO";

	/**
	 * The ReportUserSurveyEvent is an event to report the results of a survey to the server. The server then stores the
	 * results with additional server side data on the game tracking server.
	 *
	 * @see https://sites.google.com/a/goodgamestudios.com/tech-wiki/java/gamedocumentation/core/events/reportusersurveyevent
	 */
	export class CoreC2SReportUserSurveyVO extends BasicCommandVO
	{
		/**
		 * Time to complete survey in seconds
		 */
		public ttc:number;

		/**
		 * Clicks on "submit" to complete survey (indicative of trying to submit the survey without filling it out completely)
		 */
		public ctc:number;

		/**
		 * isLazy 0 or 1, check if actual level fits Level category. (It's an indicator that the user just submitted the
		 * survey without caring to give meaningful answers - this way, Data Analysis can just ignore those answers.
		 */
		public il:number;

		/**
		 * isCanceled 0 or 1, if the dialog was closed instead of submitted
		 */
		public ic:number;

		/**
		 * Answers JSONObject that maps the question to the answer
		 * e.g. {"q1":[0,2,4], "q2":[1], "q3":[], "q4": "Foo"}
		 */
		public a:Object;

		/*override*/ public getCmdId():string
		{
			return BasicSmartfoxConstants.C2S_REPORT_USER_SURVEY;
		}

		constructor( timeToComplete:number, clicksToComplete:number, isLazy:number, isCanceled:number, answers:Object ){
			this.ttc = timeToComplete;
			this.ctc = clicksToComplete;
			this.il = isLazy;
			this.ic = isCanceled;
			this.a = answers;
		}
	}

