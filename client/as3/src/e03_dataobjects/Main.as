package e03_dataobjects
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
		protected var _players:AdvancedDictionary;
		
		public function Main(log:LogConsole, blocker:Blocker)
		{
			_blocker = blocker;
			_log = log;
			
			_players = new AdvancedDictionary();
			
			_gordon = new GordonClient();
			
			_gordon.events.onConnect.add(onConnect);
			_gordon.events.onDisconnect.add(onDisconnect);
			
			_gordon.events.onJoin.add(onJoin);
			_gordon.events.onJoinError.add(onJoinError);
			
			_gordon.events.onNewUser.add(onNewUser);
			_gordon.events.onRemoveUser.add(onRemoveUser);
			
			_log.add("Connecting to 127.0.0.1:9091");
			
			_gordon.connect("127.0.0.1", 9091);
		}
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
		protected function addPlayer(user:User, isRemotePlayer:Boolean = true):void 
		{
			var player:Player = new Player(user, isRemotePlayer);
			_players.put(user, player);
			stage.addChild(player);
		}
		
		protected function removePlayer(user:User):void 
		{
			var player:Player = _players.remove(user, true) as Player;
			if (player.parent) stage.removeChild(player);
		}
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		protected function onNewUser(user:User):void
		{
			_log.add("User", user.name, "joined.");
			addPlayer(user);
		}
		
		protected function onRemoveUser(user:User):void
		{
			_log.add("User", user.name, "left.");
			removePlayer(user);
		}
		
		protected function onJoinError(errorCode:int):void
		{
			_log.add("Join error. Code:", errorCode);
			_blocker.show(false);
		}
		
		protected function onJoin(user:User):void
		{
			_log.add("Joined.");
			_blocker.show(false);
			
			//create my player
			addPlayer(user, false);
		}
		
		protected function onConnect():void
		{
			_log.add("Connected!");
			
			//create player's data structure
			var dataObject:DataObject = new DataObject();
			dataObject.setShort(PlayerDataKey.X_POS, -200);
			dataObject.setShort(PlayerDataKey.Y_POS, -200);
			
			var name:String = "gordon" + int(Math.random() * 1000);
			_log.add("Joining as", name, "...");
			
			_gordon.join("example03", "room1", name, dataObject);
		}
		
		protected function onDisconnect():void
		{
			_log.add("Disconnected!");
			_blocker.show(false);
		}
	
	}

}