package e06_logicmodifiers 
{
	import com.bit101.components.InputText;
	import com.bit101.components.Label;
	import com.bit101.components.List;
	import com.bit101.components.PushButton;
	import com.bit101.components.RadioButton;
	import com.bit101.components.TextArea;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import net.electronauts.gordon.DataObject;
	import net.electronauts.gordon.GordonClient;
	import net.electronauts.gordon.Room;
	import net.electronauts.gordon.User;
	import shared.Blocker;
	import shared.LogConsole;
	/**
	 * @author BMA | bma@electronauts.net
	 */
	public class Main extends Sprite
	{
		protected var _log:LogConsole;
		protected var _gordon:GordonClient;
		protected var _blocker:Blocker;
		protected var _button_room1:RadioButton;
		protected var _button_room2:RadioButton;
		protected var _button_room3:RadioButton;
		protected var _list_user:List;
		protected var _text_messages:TextArea;
		protected var _input:InputText;
		
		public function Main(log:LogConsole, blocker:Blocker) 
		{
			_blocker = blocker;
			_log = log;
			
			//create ui
			_button_room1 = new RadioButton(this, 0, 0, "Room1", true, onRoomClicked);
			_button_room2 = new RadioButton(this, 100, 0, "Room2", false, onRoomClicked);
			_button_room3 = new RadioButton(this, 200, 0, "Room3", false, onRoomClicked);
			
			new Label(this, 0, 35, "Users");
			_list_user = new List(this, 0, 50);
			_list_user.height = 250;
			_list_user.width = 150;
			
			new Label(this, 170, 35, "Messages");
			_text_messages = new TextArea(this, 170, 50);
			_text_messages.width = 400;
			_text_messages.height = 230;
			
			_input = new InputText(this, 170, 285, "");
			_input.width = 200;
			new PushButton(this, 380, 285, "Send", onMessageEntered);
			
			
			//create gordon client
			_gordon = new GordonClient();
			
			_gordon.events.onConnect.add(onConnect);
			_gordon.events.onDisconnect.add(onDisconnect);
			
			_gordon.events.onJoin.add(onJoin);
			_gordon.events.onJoinError.add(onJoinError);
			
			_gordon.events.onChangeRoom.add(onChangeRoom);
			_gordon.events.onChangeRoomError.add(onChangeRoomError);
			
			_gordon.events.onNewUser.add(onNewUser);
			_gordon.events.onRemoveUser.add(onRemoveUser);
			
			_gordon.events.onChatMessage.add(onChatMessage);
			
			_log.add("Connecting to 127.0.0.1:9091");
			
			_gordon.connect("127.0.0.1", 9091);
		}
		
	
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onMessageEntered(e:Event):void 
		{
			var message:String = _input.text;
			if (message == "") return;
			_gordon.sendChatMessage(message);
			_input.text = "";
		}
		
		protected function onRoomClicked(e:MouseEvent):void 
		{
			var roomId:String = RadioButton(e.currentTarget).label.toLowerCase();
			_log.add("Changing to room:", roomId);
			_gordon.changeRoom(roomId);
			_blocker.show(true);
		}
		
		
		
		protected function onChatMessage(sender:User, message:String):void 
		{
			_text_messages.textField.appendText(sender.name + ": " + message + "\n");
			_text_messages.textField.scrollV = _text_messages.textField.maxScrollV;
		}
		
		protected function onChangeRoom(newRoom:Room):void 
		{
			_log.add("Changed to room:", newRoom.id);
			_blocker.show(false);
		}
		
		protected function onChangeRoomError(errorCode:int):void 
		{
			_log.add("Change room error: Code:", errorCode);
			_blocker.show(false);
		}
		
		protected function onNewUser(user:User):void 
		{
			_log.add("User", user.name, "joined.");
		}
		
		protected function onRemoveUser(user:User):void 
		{
			_log.add("User", user.name, "left.");
		}
		
		
		protected function onJoinError(errorCode:int):void 
		{
			_log.add("Join error. Code:", errorCode);
		}
		
		protected function onJoin(user:User):void 
		{
			_log.add("Joined.");
			_blocker.show(false);
			
			_log.add(_gordon.me.dataObject.getShort(0));
			_log.add(_gordon.me.dataObject.getString(1));
		}
		
		protected function onConnect():void 
		{
			_log.add("Connected!");
			
			var dataObject:DataObject = new DataObject();
			dataObject.setShort(0, 1000);
			dataObject.setString(1, "the answer is 42!");
			
			var name:String = "gordon" + int(Math.random() * 1000);
			_log.add("Joining as", name, "...");
			
			_gordon.join("example06", "room1", name, dataObject);
		}
		
		protected function onDisconnect():void 
		{
			_log.add("Disconnected!");
			_blocker.show(false);
		}
		
	}

}