package com.goodgamestudios.basic.controller.clientCommands
{

	import com.goodgamestudios.basic.model.BasicModel;
	import com.goodgamestudios.basic.model.proxy.InstanceVOProxy;
	import com.goodgamestudios.language.countries.AbstractGGSCountry;
	import com.goodgamestudios.language.countryMapper.GGSCountryController;
	import com.goodgamestudios.logging.info;
	import com.goodgamestudios.net.socketserver.parser.vo.InstanceVO;

	public final class BasicInitActiveCountriesCommand extends BasicClientCommand
	{
		public static const NAME:String = "BasicInitActiveCountriesCommand";

		override public function execute( commandVars:Object = null ):void
		{
			var instanceProxy:InstanceVOProxy = BasicModel.instanceProxy;
			var allInstances:Vector.<InstanceVO> = instanceProxy.instanceMap;

			var activeCountries:Vector.<AbstractGGSCountry> = new Vector.<AbstractGGSCountry>();

			// Collect all occuring country codes in all instances of the current network
			for each (var instanceVO:InstanceVO in allInstances)
			{
				for each(var ggsCountry:AbstractGGSCountry in instanceVO.countries)
				{
					activeCountries.push( ggsCountry );
				}
			}

			// Remove duplicate countries occuring in the instances
			activeCountries = removeDuplicates( activeCountries );

			info("Instances amount: " + allInstances.length + ", unique activeCountries amount: " + activeCountries.length);

			// Activate countries
			GGSCountryController.instance.initActiveCountries( activeCountries );
		}

		private function removeDuplicates( activeCountries:Vector.<AbstractGGSCountry> ):Vector.<AbstractGGSCountry>
		{
			var resultNoDuplicates:Vector.<AbstractGGSCountry> = new Vector.<AbstractGGSCountry>;

			var len:uint = activeCountries.length;
			var i:uint = 0;

			while (i < len)
			{
				if (resultNoDuplicates.indexOf( activeCountries[i] ) == -1)
				{
					resultNoDuplicates.push( activeCountries[i] );
				}

				i++;
			}

			return resultNoDuplicates;
		}
	}
}
