package shared  
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.text.TextField;
	import shared.Blocker;
	import shared.LogConsole;
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class BaseExample extends Sprite
	{
		protected var _main:Class;
		protected var _title:String;
		
		public function BaseExample(main:Class, title:String) 
		{
			_title = title;
			_main = main;
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		protected function init(e:Event = null):void 
		{
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			var log:LogConsole = new LogConsole();
			var blocker:Blocker = new Blocker();
			
			
			var ui:Sprite = new asset_ui();
			ui["text_title"].text = _title;
			
			var main:DisplayObject = new _main(log, blocker);
			main.x = 20;
			main.y = 150;
			addChild(main);
			addChild(ui);
			addChild(log);
			addChild(blocker);
		}
	}

}