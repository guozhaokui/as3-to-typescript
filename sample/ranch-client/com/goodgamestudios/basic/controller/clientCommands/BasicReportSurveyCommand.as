package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.controller.BasicSmartfoxConstants;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;

	public class BasicReportSurveyCommand extends SimpleCommand
	{
		override public function execute( commandVars:Object = null ):void
		{
			var surveyCompletionTime:uint = commandVars[0]; // seconds the user took to fill out the survey

			/* submitClickCount is how often the user clicked "submit" (indicative of trying to submit the survey
			 without filling it out completely */
			var submitClickCount:int = commandVars[1];

			var categoryUserLevel:int = commandVars[2]; // category ranges are defined by the individual games
			var categoryUserGender:int = commandVars[3]; // 0: male, 1:female
			var categoryUserAge:int = commandVars[4]; // category ranges are defined by the individual games

			/* isUserLazy means that the user has given a level category that doesn't match his level. (It's an
			 indicator that the user just submitted the survey without caring to give meaningful answers - this way,
			 Data Analysis can just ignore those answers. Plus it makes for an interesting statistic. :-) )*/
			var isUserLazy:Boolean = commandVars[5];

			/* the user may close the survey dialog without wanting to submit… and that gets submitted anyway, with
			 this flag set to true. Catch 22 anyone? */
			var wasCancelled:Boolean = commandVars[6];

			var surveyAnswers:Array = commandVars[7];

			BasicModel.smartfoxClient.sendMessage(
					BasicSmartfoxConstants.C2S_REPORT_SURVEY,
					[
						surveyCompletionTime,
						submitClickCount,
						categoryUserLevel,
						categoryUserGender,
						categoryUserAge,
						isUserLazy ? 1 : 0,
						wasCancelled ? 1 : 0,
						JSON.stringify( surveyAnswers )
					]
			);
		}
	}
}