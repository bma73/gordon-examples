package shared 
{
	import com.greensock.TweenLite;
	import com.greensock.TweenMax;
	import flash.display.Sprite;
	import flash.events.Event;
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class Blocker extends Sprite
	{
		
		public function Blocker() 
		{
			addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		}
		
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function show(value:Boolean):void 
		{
			if (value)
			{
				TweenMax.to(this, 0.3, { autoAlpha:1 } );
			}
			else
			{
				TweenMax.to(this, 0.3, { autoAlpha:0 } );
			}
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
			stage.addEventListener(Event.RESIZE, onResize);
			onResize();
		}
		
		protected function onResize(e:Event = null):void 
		{
			graphics.clear();
			graphics.beginFill(0x1575EA, 0.8);
			graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			graphics.endFill();
		}
		
	}

}