/**
 * Created with IntelliJ IDEA.
 * User: glesouchu
 * Date: 16.05.14
 * Time: 10:45
 * To change this template use File | Settings | File Templates.
 */


	import { BasicModel } from "../../model/BasicModel";
	import { InstanceVOProxy } from "../../model/proxy/InstanceVOProxy";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class BasicInitZoneCapacityCommand extends BasicClientCommand
	{
		/*override*/ public /*final*/ execute( commandVars:Object = null ):void
		{
			var zoneCapacity:Object = commandVars.zoneCapacity;

			var instanceProxy:InstanceVOProxy = BasicModel.instanceProxy;
			var allInstances:InstanceVO[] = instanceProxy.instanceMap;
			var l:number = allInstances.length;
			for (var i:number = 0; i < l; i++)
			{
				var instanceVO:InstanceVO = allInstances[i];
				instanceVO.remainingRegistrationCapacity = this._getCapacityForZone( instanceVO.zoneId, zoneCapacity.zones );
			}
		}

		protected _getCapacityForZone( zone:number, capacities:any[] ):number
		{
			var r:number = -1;
			var l:number = capacities.length;
			for (var i:number = 0; i < l; i++)
			{
				var obj:Object = capacities[i];
				if (obj.zoneId == zone)
				{
					r = obj.remainingRegistrationCapacity;
					break;
				}
			}
			return r;
		}
	}

