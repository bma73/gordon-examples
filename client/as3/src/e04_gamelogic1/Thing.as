package e04_gamelogic1
{
	import flash.display.Sprite;
	import net.electronauts.gordon.DataObject;
	
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class Thing extends Sprite
	{
		
		protected var _dataObject:DataObject;
		
		public function Thing(dataObject:DataObject)
		{
			_dataObject = dataObject;
			
			var asset:Sprite = new asset_thing();
			addChild(asset);
			
			//listen to the thing's update events
			_dataObject.events.onUpdate.add(onUpdate);
			
			x = _dataObject.getShort(ThingDataKey.X_POS);
			y = _dataObject.getShort(ThingDataKey.Y_POS);
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function dispose():void
		{
			_dataObject.events.onUpdate.remove(onUpdate);
			_dataObject = null;
		}
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onUpdate(updatedKeys:Array):void
		{
			var active:Boolean = _dataObject.getBoolean(ThingDataKey.ACTIVE);
			alpha = active ? 1 : 0.5;
		}
	}

}