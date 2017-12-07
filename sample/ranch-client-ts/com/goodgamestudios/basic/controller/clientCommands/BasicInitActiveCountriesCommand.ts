

	import { BasicModel } from "../../model/BasicModel";
	import { InstanceVOProxy } from "../../model/proxy/InstanceVOProxy";
	import { AbstractGGSCountry } from "../../../language/countries/AbstractGGSCountry";
	import { GGSCountryController } from "../../../language/countryMapper/GGSCountryController";
	import { info } from "../../../logging/info";
	import { InstanceVO } from "../../../net/socketserver/parser/vo/InstanceVO";

	export class BasicInitActiveCountriesCommand extends BasicClientCommand
	{
		public static NAME:string = "BasicInitActiveCountriesCommand";

		/*override*/ public execute( commandVars:Object = null ):void
		{
			var instanceProxy:InstanceVOProxy = BasicModel.instanceProxy;
			var allInstances:InstanceVO[] = instanceProxy.instanceMap;

			var activeCountries:AbstractGGSCountry[] = [];

			// Collect all occuring country codes in all instances of the current network
			for  (var instanceVO:InstanceVO of allInstances)
			{
				for (var ggsCountry:AbstractGGSCountry of instanceVO.countries)
				{
					activeCountries.push( ggsCountry );
				}
			}

			// Remove duplicate countries occuring in the instances
			activeCountries = this.removeDuplicates( activeCountries );

			info("Instances amount: " + allInstances.length + ", unique activeCountries amount: " + activeCountries.length);

			// Activate countries
			GGSCountryController.instance.initActiveCountries( activeCountries );
		}

		private removeDuplicates( activeCountries:AbstractGGSCountry[] ):AbstractGGSCountry[]
		{
			var resultNoDuplicates:AbstractGGSCountry[] = [];

			var len:number = activeCountries.length;
			var i:number = 0;

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

