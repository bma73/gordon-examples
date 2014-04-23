package e05_gamelogic2
{
	import com.greensock.easing.Bounce;
	import com.greensock.TweenMax;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.ColorTransform;
	import flash.utils.ByteArray;
	import net.electronauts.gordon.DataObject;
	import net.electronauts.gordon.GordonClient;
	
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class Thing extends Sprite
	{
		
		protected var _dataObject:DataObject;
		protected var _gordon:GordonClient;
		
		public function Thing(gordon:GordonClient, dataObject:DataObject)
		{
			_gordon = gordon;
			_dataObject = dataObject;
			
			var asset:Sprite = new asset_thing();
			addChild(asset);
			
			//listen to the thing's events
			_dataObject.events.onUpdate.add(onUpdate);
			_dataObject.events.onDispose.add(onDispose);
			
			//init sprite
			x = _dataObject.getShort(ThingDataKey.X_POS);
			y = _dataObject.getShort(ThingDataKey.Y_POS);
			onUpdate(null);
			
			var ct:ColorTransform = new ColorTransform();
			ct.color = _dataObject.getUnsignedInteger(ThingDataKey.COLOR);
			Sprite(asset["mc_inner"]["mc_fill"]).transform.colorTransform = ct; 
			
			addEventListener(MouseEvent.CLICK, onMouseClick);
			
			TweenMax.from(this, 0.5, { scaleX:2, scaleY:2, ease:Bounce.easeOut } );
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function dispose():void
		{
			if (parent) parent.removeChild(this);
			_dataObject.events.onUpdate.remove(onUpdate);
			_dataObject = null;
			_gordon = null;
		}
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onUpdate(updatedKeys:Array):void
		{
			var active:Boolean = _dataObject.getBoolean(ThingDataKey.ACTIVE);
			alpha = active ? 1 : 0.5;
		}
		
		protected function onDispose():void 
		{
			dispose();
		}
		
		
		protected function onMouseClick(e:MouseEvent):void 
		{
			 //we'll use a custom message to inform the server about the click event
			
			 var buffer:ByteArray = new ByteArray();
			 //let the code for the click event be - ehrm - 11 ;)
			buffer.writeByte(11);
			 //write the dataobject id
			buffer.writeShort(_dataObject.id);
			//send the message to the server
			_gordon.sendCustomMessage(buffer);
		}
	}

}