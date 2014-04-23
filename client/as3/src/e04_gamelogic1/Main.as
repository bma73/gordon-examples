package e04_gamelogic1
{
	import flash.display.Sprite;
	import net.electronauts.gordon.DataObject;
	import net.electronauts.gordon.GordonClient;
	import net.electronauts.gordon.User;
	import net.electronauts.gordon.util.AdvancedDictionary;
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
		
		public function Main(log:LogConsole, blocker:Blocker)
		{
			_blocker = blocker;
			_log = log;
			
			_gordon = new GordonClient();
			
			_gordon.events.onConnect.add(onConnect);
			_gordon.events.onDisconnect.add(onDisconnect);
			
			_gordon.events.onJoin.add(onJoin);
			_gordon.events.onJoinError.add(onJoinError);
			
			//listen for new dataObject events
			_gordon.events.onNewDataObject.add(onNewDataObject);
			
			_gordon.events.onNewUser.add(onNewUser);
			_gordon.events.onRemoveUser.add(onRemoveUser);
			
			_log.add("Connecting to 127.0.0.1:9091");
			
			_gordon.connect("127.0.0.1", 9091);
		}
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onNewDataObject(dataObject:DataObject):void 
		{
			var type:int = dataObject.getUnsignedByte(ThingDataKey.TYPE);
			
			switch (type) 
			{
				case 1:
					var thing:Thing = new Thing(dataObject);
					stage.addChild(thing);
					break;
				
				//... add other types
			}
			
			
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
		}
		
		protected function onConnect():void
		{
			_log.add("Connected!");
			
			var name:String = "gordon" + int(Math.random() * 1000);
			_log.add("Joining as", name, "...");
			
			_gordon.join("example04", "room1", name);
		}
		
		protected function onDisconnect():void
		{
			_log.add("Disconnected!");
			_blocker.show(false);
		}
	
	}

}