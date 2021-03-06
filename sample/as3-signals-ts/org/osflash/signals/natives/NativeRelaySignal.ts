import { INativeDispatcher } from "./INativeDispatcher";
	import { ISlot } from "../ISlot";
	import { Signal } from "../Signal";
	import { Slot } from "../Slot";
	import { SlotList } from "../SlotList";

	import { Event } from "../../../../flash/events/Event";
	import { IEventDispatcher } from "../../../../flash/events/IEventDispatcher";

	/**
	 * The NativeRelaySignal class is used to relay events from an IEventDispatcher
	 * to listeners.
	 * The difference as compared to NativeSignal is that
	 * NativeRelaySignal has its own dispatching code,
	 * whereas NativeSignal uses the IEventDispatcher to dispatch.
	 */
	export class NativeRelaySignal extends Signal implements INativeDispatcher
	{

		protected _target:IEventDispatcher;
		protected _eventType:string;
		protected _eventClass:Object;

		/**
		 * Creates a new NativeRelaySignal instance to relay events from an IEventDispatcher.
		 * @param	target	An object that implements the flash.events.IEventDispatcher interface.
		 * @param	eventType	The event string name that would normally be passed to IEventDispatcher.addEventListener().
		 * @param	eventClass An optional class reference that enables an event type check in dispatch().
		 * Because the target is an IEventDispatcher,
		 * eventClass needs to be flash.events.Event or a subclass of it.
		 */
		constructor(target:IEventDispatcher, eventType:string, eventClass:Object = null){
			super(eventClass || Event);

			this.eventType = eventType;
			this.eventClass = eventClass;
			this.target = target;
		}


		/** @inheritDoc */
		public get target():IEventDispatcher
		{
			return this._target;
		}

		public set target(value:IEventDispatcher)
		{
			if (value == this._target) return;
			if (this._target) this.removeAll();
			this._target = value;
		}

		/** @inheritDoc */
		public get eventType():string { return this._eventType; }

		public set eventType(value:string) { this._eventType = value; }

		/** @inheritDoc */
		public get eventClass():Object { return this._eventClass; }

		public set eventClass(value:Object)
		{
			this._eventClass = value || Event;
			this._valueClasses = [this._eventClass];
		}

		/*override*/ public set valueClasses(value:any[])
		{
			this.eventClass = (value && value.length > 0) ? value[0] : null;
		}

		/**
		 * @inheritDoc
		 * @throws flash.errors.IllegalOperationError <code>IllegalOperationError</code>: You cannot addOnce() then add() the same listener without removing the relationship first.
		 * @throws ArgumentError <code>ArgumentError</code>: Given listener is <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Target object cannot be <code>null</code>.
		 */
		/*override*/ public add(listener:Function):ISlot
		{
			return this.addWithPriority(listener);
		}

		/**
		 * @inheritDoc
		 * @throws flash.errors.IllegalOperationError <code>IllegalOperationError</code>: You cannot addOnce() then add() the same listener without removing the relationship first.
		 * @throws ArgumentError <code>ArgumentError</code>: Given listener is <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Target object cannot be <code>null</code>.
		 */
		/*override*/ public addOnce(listener:Function):ISlot
		{
			return this.addOnceWithPriority(listener);
		}

		/**
		 * @inheritDoc
		 * @throws flash.errors.IllegalOperationError <code>IllegalOperationError</code>: You cannot addOnce() then add() the same listener without removing the relationship first.
		 * @throws ArgumentError <code>ArgumentError</code>: Given listener is <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Target object cannot be <code>null</code>.
		 */
		public addWithPriority(listener:Function, priority:number = 0):ISlot
		{
			return this.registerListenerWithPriority(listener, false, priority);
		}

		/**
		 * @inheritDoc
		 * @throws flash.errors.IllegalOperationError <code>IllegalOperationError</code>: You cannot addOnce() then add() the same listener without removing the relationship first.
		 * @throws ArgumentError <code>ArgumentError</code>: Given listener is <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Target object cannot be <code>null</code>.
		 */
		public addOnceWithPriority(listener:Function, priority:number = 0):ISlot
		{
			return this.registerListenerWithPriority(listener, true, priority);
		}

		/** @inheritDoc */
		/*override*/ public remove(listener:Function):ISlot
		{
			var nonEmptyBefore:boolean = this.slots.nonEmpty;
			var slot:ISlot = super.remove(listener);
			if (nonEmptyBefore != this.slots.nonEmpty)
				this.target.removeEventListener(this.eventType, this.onNativeEvent);
			return slot;
		}

		/**
		 * @inheritDoc
		 */
		/*override*/ public removeAll():void
		{
			if (this.target) this.target.removeEventListener(this.eventType, this.onNativeEvent);
			super.removeAll();
		}

		/**
		 * @inheritDoc
		 * @throws ArgumentError <code>ArgumentError</code>: Event object expected.
		 * @throws ArgumentError <code>ArgumentError</code>: No more than one Event object expected.
		 * @throws ArgumentError <code>ArgumentError</code>: Target object cannot be <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Event object cannot be <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Event object [event] is not an instance of [eventClass].
		 * @throws ArgumentError <code>ArgumentError</code>: Event object has incorrect type. Expected [eventType] but was [event.type].
		 */
		/*override*/ public dispatch(...valueObjects):void
		{
			if (null == valueObjects) throw new Error('Event object expected.');

			if (valueObjects.length != 1) throw new Error('No more than one Event object expected.');

			this.dispatchEvent((<Event>valueObjects[0] ));
		}

		/**
		 * Unlike other signals, NativeRelaySignal does not dispatch null
		 * because it causes an exception in EventDispatcher.
		 * @inheritDoc
		 * @throws ArgumentError <code>ArgumentError</code>: Target object cannot be <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Event object cannot be <code>null</code>.
		 * @throws ArgumentError <code>ArgumentError</code>: Event object [event] is not an instance of [eventClass].
		 * @throws ArgumentError <code>ArgumentError</code>: Event object has incorrect type. Expected [eventType] but was [event.type].
		 */
		public dispatchEvent(event:Event):boolean
		{
			if (!this.target) throw new Error('Target object cannot be null.');
			if (!event)  throw new Error('Event object cannot be null.');

			if (!(event instanceof this.eventClass))
				throw new Error('Event object '+event+' is not an instance of '+this.eventClass+'.');

			if (event.type != this.eventType)
				throw new Error('Event object has incorrect type. Expected <'+this.eventType+'> but was <'+event.type+'>.');

			return this.target.dispatchEvent(event);
		}

		protected onNativeEvent(event:Event):void
		{
			var slotsToProcess:SlotList = this.slots;

			while (slotsToProcess.nonEmpty)
			{
				slotsToProcess.head.execute1(event);
				slotsToProcess = slotsToProcess.tail;
			}
		}

		protected registerListenerWithPriority(listener:Function, once:boolean = false, priority:number = 0):ISlot
		{
			if (!this.target) throw new Error('Target object cannot be null.');
			var nonEmptyBefore:boolean = this.slots.nonEmpty;

			var slot:ISlot = null;
			if (this.registrationPossible(listener, once))
			{
				slot = new Slot(listener, this, once, priority);
				this.slots = this.slots.insertWithPriority(slot);
			}
			else
				slot = this.slots.find(listener);

			// Account for cases where the same listener is added twice.
			if (nonEmptyBefore != this.slots.nonEmpty)
				this.target.addEventListener(this.eventType, this.onNativeEvent, false, priority);

			return slot;
		}

	}

