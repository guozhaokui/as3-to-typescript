package com.goodgamestudios.basic.controller.clientCommands.tracking.vo
{

	public class FacebookUserDataTrackingCommandVO
	{

		/**
		 * mandatory field
		 */
		public var facebookId:String;

		/**
		 * mandatory field
		 * 0 if false / 1 if true;
		 */
		public var isAccountVerified:int;

		/**
		 * mandatory field
		 */
		public var fullName:String;

		public var firstName:String;
		public var lastName:String;
		public var profileLink:String;
		public var gender:String;
		public var locale:String;
		public var ageRange:String;
		public var utcOffset:Number;
		public var birthday:String;
		public var email:String;
		public var facebookBusinessToken:String;
	}
}