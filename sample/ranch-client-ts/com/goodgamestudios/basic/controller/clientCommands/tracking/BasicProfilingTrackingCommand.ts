/**
 * Created with IntelliJ IDEA.
 * User: pburst
 * Date: 24.09.12
 * Time: 11:42
 * To change this template use File | Settings | File Templates.
 */


	import { EnvGlobalsHandler } from "../../../EnvGlobalsHandler";
	import { BasicModel } from "../../../model/BasicModel";
	import { SimpleCommand } from "../../../../commanding/SimpleCommand";
	import { PerformanceMonitoringService } from "../../../../profiling/service/PerformanceMonitoringService";
	import { PerformanceMonitoringVO } from "../../../../profiling/vo/PerformanceMonitoringVO";
	import { ProfilingTrackingEvent } from "../../../../tracking/ProfilingTrackingEvent";
	import { TrackingCache } from "../../../../tracking/TrackingCache";
	import { TrackingEventIds } from "../../../../tracking/constants/TrackingEventIds";

	export class BasicProfilingTrackingCommand extends SimpleCommand

	{

		/*override*/ public execute( commandVars:Object = null ):void
		{
			PerformanceMonitoringService.getInstance().startMonitoring();
			PerformanceMonitoringService.getInstance().onMeasurementFinished.add( this.onPerformanceMonitoringMeasurementFinished )
		}

		private onPerformanceMonitoringMeasurementFinished():void
		{
			var profilingTrackingEvent:ProfilingTrackingEvent = (<ProfilingTrackingEvent>TrackingCache.getInstance().getEvent( TrackingEventIds.PROFILING ) );

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

