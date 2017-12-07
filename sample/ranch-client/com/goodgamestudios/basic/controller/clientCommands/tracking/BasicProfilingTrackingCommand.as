/**
 * Created with IntelliJ IDEA.
 * User: pburst
 * Date: 24.09.12
 * Time: 11:42
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands.tracking
{

	import com.goodgamestudios.basic.EnvGlobalsHandler;
	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.commanding.SimpleCommand;
	import com.goodgamestudios.profiling.service.PerformanceMonitoringService;
	import com.goodgamestudios.profiling.vo.PerformanceMonitoringVO;
	import com.goodgamestudios.tracking.ProfilingTrackingEvent;
	import com.goodgamestudios.tracking.TrackingCache;
	import com.goodgamestudios.tracking.constants.TrackingEventIds;

	public class BasicProfilingTrackingCommand extends SimpleCommand

	{

		override public function execute( commandVars:Object = null ):void
		{
			PerformanceMonitoringService.getInstance().startMonitoring();
			PerformanceMonitoringService.getInstance().onMeasurementFinished.add( onPerformanceMonitoringMeasurementFinished )
		}

		private function onPerformanceMonitoringMeasurementFinished():void
		{
			var profilingTrackingEvent:ProfilingTrackingEvent = TrackingCache.getInstance().getEvent( TrackingEventIds.PROFILING ) as ProfilingTrackingEvent;

			profilingTrackingEvent.gameId = EnvGlobalsHandler.globals.gameId;
			profilingTrackingEvent.networkId = EnvGlobalsHandler.globals.networkId;
			profilingTrackingEvent.instanceID = BasicModel.instanceProxy.selectedInstanceVO.instanceId;
			profilingTrackingEvent.downloadSpeed = BasicModel.basicLoaderData.downloadRateFrameOne;
			profilingTrackingEvent.playerID = BasicModel.userData.playerID;

			var averageMeasurementResults:PerformanceMonitoringVO = PerformanceMonitoringService.getInstance().performanceMonitoringProxy.averageMeasurementResults;
			PerformanceMonitoringService.getInstance().trackingCommand.performTracking( averageMeasurementResults, BasicModel.userData.userLevel );
			PerformanceMonitoringService.getInstance().externalLogCommand.performLog( averageMeasurementResults, 1 )
		}
	}
}
