package shared 
{
	import com.bit101.components.TextArea;
	import flash.display.Sprite;
	import flash.events.Event;
	/**
	 * ...
	 * @author BMA | bma@electronauts.net
	 */
	public class LogConsole extends Sprite
	{
		protected var _textArea:TextArea;
		
		public function LogConsole() 
		{
			addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			_textArea = new TextArea(this);
			_textArea.alpha = 0.8;
		}
		
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function add(...args):void 
		{
			_textArea.text += args.join(" ") + "\n";
			_textArea.textField.scrollV = _textArea.textField.maxScrollV;
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
			_textArea.x = 5;
			_textArea.y = stage.stageHeight - 150 - 5; 
			_textArea.width = stage.stageWidth - 10;;
			_textArea.height = 150;
		}
		
	}

}