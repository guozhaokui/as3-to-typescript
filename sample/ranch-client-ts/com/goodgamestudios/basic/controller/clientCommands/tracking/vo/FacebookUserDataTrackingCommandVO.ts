

	export class FacebookUserDataTrackingCommandVO
	{

		/**
		 * mandatory field
		 */
		public facebookId:string;

		/**
		 * mandatory field
		 * 0 if false / 1 if true;
		 */
		public isAccountVerified:number;

		/**
		 * mandatory field
		 */
		public fullName:string;

		public firstName:string;
		public lastName:string;
		public profileLink:string;
		public gender:string;
		public locale:string;
		public ageRange:string;
		public utcOffset:number;
		public birthday:string;
		public email:string;
		public facebookBusinessToken:string;
	}
