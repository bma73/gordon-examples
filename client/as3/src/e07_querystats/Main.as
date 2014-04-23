package e07_querystats 
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
		protected var _list_session:List;
		protected var _list_rooms:List;
		protected var _list_users:List;
		
		public function Main(log:LogConsole, blocker:Blocker) 
		{
			_blocker = blocker;
			_log = log;
			
			//create ui
			new Label(this, 0, 0, "Sessions");
			_list_session = new List(this, 0, 15);
			_list_session.width = 200;
			_list_session.height = 250;
			_list_session.addEventListener(Event.SELECT, onSessionSelected);
			
			new Label(this, 230, 35, "Rooms");
			_list_rooms = new List(this, 230, 15);
			_list_rooms.width = 200;
			_list_rooms.height = 250;
			_list_rooms.addEventListener(Event.SELECT, onRoomSelected);
			
			new Label(this, 460, 35, "Users");
			_list_users = new List(this, 460, 15);
			_list_users.width = 200;
			_list_users.height = 250;
			
			
			//create gordon client
			_gordon = new GordonClient();
			
			_gordon.events.onConnect.add(onConnect);
			_gordon.events.onDisconnect.add(onDisconnect);
			
			_log.add("Connecting to 127.0.0.1:9091");
			
			_gordon.connect("127.0.0.1", 9091);
		}
		
	
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onConnect():void 
		{
			_log.add("Connected!");
			//load the session list
			_gordon.getSessionList(onSessionList);
			_blocker.show(false);
		}
		
		protected function onDisconnect():void 
		{
			_log.add("Disconnected!");
			_blocker.show(false);
		}
		
		protected function onSessionList(list:Array):void 
		{
			for (var i:int = 0; i < list.length; i++) 
			{
				var session:Object = list[i];
				_list_session.addItem( { label:session.id + "/" + session.name, data:session.id } );
			}
		}
		
		protected function onSessionSelected(e:Event):void 
		{
			_list_rooms.removeAll();
			_list_users.removeAll();
			_gordon.getRoomList(_list_session.selectedItem.data, onRoomList);
		}
		
		protected function onRoomList(list:Array):void 
		{
			for (var i:int = 0; i < list.length; i++) 
			{
				var room:Object = list[i];
				_list_rooms.addItem( { label:room.id + "/" + room.name, data:room.id } );
			}
		}
		
		protected function onRoomSelected(e:Event):void 
		{
			_list_users.removeAll();
			_gordon.getUserList(_list_session.selectedItem.data, _list_rooms.selectedItem.data, onUserList);
		}
		
		protected function onUserList(list:Array):void 
		{
			for (var i:int = 0; i < list.length; i++) 
			{
				var user:Object = list[i];
				_list_users.addItem( { label:user.id + "/" + user.name, data:user.id } );
			}
		}
	}
}