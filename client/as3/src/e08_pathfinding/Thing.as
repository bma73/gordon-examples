package e08_pathfinding
{
	import com.greensock.easing.Linear;
	import com.greensock.TweenMax;
	import flash.display.Sprite;
	import flash.filters.DropShadowFilter;
	import net.electronauts.gordon.DataObject;
	import net.electronauts.gordon.GordonClient;
	
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class Thing extends Sprite
	{
		
		protected var _dataObject:DataObject;
		protected var _waypoints:Array;
		protected var _moveDuration:Number;
		protected var _gordon:GordonClient;
		
		public function Thing(gordon:GordonClient, dataObject:DataObject)
		{
			_gordon = gordon;
			_dataObject = dataObject;
			_waypoints = [];
			
			filters = [new DropShadowFilter(2, 45, 0, 0.8, 8, 8)];
			
			cacheAsBitmap = true;
			
			var asset:Sprite = new asset_thing2();
			addChild(asset);
			
			//listen to the thing's update events
			_dataObject.events.onUpdate.add(onUpdate);
			
			_moveDuration = _dataObject.getShort(ThingDataKey.MOVE_DURATION) * 0.001;
			x = _dataObject.getByte(ThingDataKey.X_POS) * Main.TILE_SIZE;
			y = _dataObject.getByte(ThingDataKey.Y_POS) * Main.TILE_SIZE;
			
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function dispose():void
		{
			TweenMax.killTweensOf(this);
			_dataObject.events.onUpdate.remove(onUpdate);
			_dataObject = null;
			if (parent) parent.removeChild(this);
		}
		
		//**********************************************************************
		//* Protected 				  										   *
		//**********************************************************************
		protected function moveToNextWaypoint():void 
		{
			if (_waypoints.length == 0) return;
			if (TweenMax.isTweening(this)) return;
			var waypoint:Array = _waypoints.shift() as Array;
			TweenMax.to(this, _moveDuration - _gordon.ping * 0.001,
						{x: waypoint[0], y: waypoint[1], ease: Linear.easeNone, onComplete:moveToNextWaypoint});
		}
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onUpdate(updatedKeys:Array):void
		{
			var x:int = _dataObject.getByte(ThingDataKey.X_POS) * Main.TILE_SIZE;
			var y:int = _dataObject.getByte(ThingDataKey.Y_POS) * Main.TILE_SIZE;
			_waypoints.push([x, y]);
			moveToNextWaypoint();
		}
	}
}