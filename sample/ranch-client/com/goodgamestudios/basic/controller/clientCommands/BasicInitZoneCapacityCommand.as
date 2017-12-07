/**
 * Created with IntelliJ IDEA.
 * User: glesouchu
 * Date: 16.05.14
 * Time: 10:45
 * To change this template use File | Settings | File Templates.
 */
package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.model.proxy.InstanceVOProxy;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	public class BasicInitZoneCapacityCommand extends BasicClientCommand
	{
		override public final function execute( commandVars:Object = null ):void
		{
			var zoneCapacity:Object = commandVars.zoneCapacity;

			var instanceProxy:InstanceVOProxy = BasicModel.instanceProxy;
			var allInstances:Vector.<InstanceVO> = instanceProxy.instanceMap;
			var l:int = allInstances.length;
			for (var i:int = 0; i < l; i++)
			{
				var instanceVO:InstanceVO = allInstances[i];
				instanceVO.remainingRegistrationCapacity = _getCapacityForZone( instanceVO.zoneId, zoneCapacity.zones );
			}
		}

		protected function _getCapacityForZone( zone:int, capacities:Array ):Number
		{
			var r:Number = -1;
			var l:int = capacities.length;
			for (var i:int = 0; i < l; i++)
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
}
