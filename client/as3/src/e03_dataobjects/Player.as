package e03_dataobjects
{
	import com.greensock.easing.Linear;
	import com.greensock.TweenMax;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.utils.getTimer;
	import net.electronauts.gordon.DataObject;
	import net.electronauts.gordon.User;
	
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class Player extends Sprite
	{
		protected var _user:User;
		protected var _isRemotePlayer:Boolean;
		
		protected var _posX:int;
		protected var _posY:int;
		protected var _nextUpdateTime:int;
		protected var _dataObject:DataObject;
		
		public function Player(user:User, isRemotePlayer:Boolean)
		{
			_isRemotePlayer = isRemotePlayer;
			_user = user;
			
			_dataObject = user.dataObject;
			
			//is it me?
			if (!isRemotePlayer)
			{
				addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			}
			else
			{
				var cursor:Sprite = new asset_cursor();
				cursor["text_name"].text = user.name;
				addChild(cursor);
				
				//listen to the player update events
				_dataObject.events.onUpdate.add(onUpdate);
			}
			
			x = _dataObject.getShort(PlayerDataKey.X_POS);
			y = _dataObject.getShort(PlayerDataKey.Y_POS);
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function dispose():void
		{
			removeEventListener(Event.ENTER_FRAME, onLoop);
			_dataObject.events.onUpdate.remove(onUpdate);
			_dataObject = null;
			_user = null;
		}
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
		
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onAddedToStage(e:Event):void
		{
			removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			addEventListener(Event.ENTER_FRAME, onLoop);
		}
		
		protected function onLoop(e:Event):void
		{
			var t:int = getTimer();
			if (t > _nextUpdateTime)
			{
				var sx:int = int(stage.mouseX);
				var sy:int = int(stage.mouseY);
				
				//update the dataObject
				if (_posX != sx)
					_dataObject.setShort(PlayerDataKey.X_POS, sx);
				if (_posY != sy)
					_dataObject.setShort(PlayerDataKey.Y_POS, sy);
				
				_posX = sx;
				_posY = sy;
				
				_dataObject.sendUpdates();
				
				//send every an update every 150ms
				_nextUpdateTime = t + 150;
			}
		}
		
		protected function onUpdate(updatedKeys:Array):void
		{
			var x:int = _dataObject.getShort(PlayerDataKey.X_POS);
			var y:int = _dataObject.getShort(PlayerDataKey.Y_POS);
			TweenMax.to(this, 0.2, {x: x, y: y, ease: Linear.easeNone});
		}
	}

}