package e08_pathfinding
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.filters.GlowFilter;
	import flash.geom.Point;
	import flash.utils.ByteArray;
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
		protected var _canvas:Sprite;
		
		public static const TILE_SIZE:int = 40;
		
		public function Main(log:LogConsole, blocker:Blocker)
		{
			_blocker = blocker;
			_log = log;
			
			//ui
			_canvas = new Sprite();
			addChild(_canvas);
			
			//Gordon stuff
			_gordon = new GordonClient();
			
			_gordon.events.onConnect.add(onConnect);
			_gordon.events.onDisconnect.add(onDisconnect);
			
			_gordon.events.onJoin.add(onJoin);
			_gordon.events.onJoinError.add(onJoinError);
			
			//the grid info will be sent via a custom message
			_gordon.events.onCustomMessage.add(onCustomMessage);
			
			//listen for new dataObject events
			_gordon.events.onNewDataObject.add(onNewDataObject);
			
			_log.add("Connecting to 127.0.0.1:9091");
			
			_gordon.connect("127.0.0.1", 9091);
		}
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
		private function drawMap(map:Array):void 
		{
			var width:int = map[0].length;
			var height:int = map.length;
			
			var back:BitmapData = new BitmapData(width * TILE_SIZE, height * TILE_SIZE, false, 0xffffffff);
			var backBitmap:Bitmap = new Bitmap(back);
			backBitmap.filters = [new GlowFilter(0, 1, 2, 2, 100)];
			
			_canvas.addChild(backBitmap);
			
			var wall:BitmapData = new asset_wall(0, 0);
			
			var p:Point = new Point();
			
			for (var y:int = 0; y < height; ++y) {
                var row:Array = map[y];
                for (var x:int = 0; x < row.length; ++x) {
                    var tile:int = row[x];
                    if (tile == 1) 
                    {
						p.x = x * TILE_SIZE;
                        p.y = y * TILE_SIZE;
						back.copyPixels(wall, wall.rect, p);
                    }
                }
            }
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
					var thing:Thing = new Thing(_gordon, dataObject);
					_canvas.addChild(thing);
					break;
				
				//... add other types
			}
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
			
			_gordon.join("example08", "room1", name);
		}
		
		protected function onDisconnect():void
		{
			_log.add("Disconnected!");
			_blocker.show(false);
		}
		
		protected function onCustomMessage(buffer:ByteArray):void 
		{
			//the server sends an "init message" with the grid data used
            //right before the join, so that the client can draw the map
			var type:int = buffer.readByte();
			switch (type) 
			{
				//init message
				case 1:
					var mapString:String = buffer.readUTFBytes(buffer.bytesAvailable);
					var map:Array = JSON.parse(mapString) as Array;
					drawMap(map);
					break;
					
				//... add other custom types		
			}
		}
	
	}

}