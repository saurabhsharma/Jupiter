var db = require('../lib/db.js');

var RoomSchema = new db.Schema({
	roomname: {
		type: String,
		unique: true
	},
	participants: [String]
})

var Room = db.mongoose.model('Room', RoomSchema);

// Exports
module.exports.getRoom = getRoom;


 
function getRoom(participants,callback){
	
	// check if a room already exists with these participants ..

	var query = "{ \"$and\":[";

	for (i = 0; i < participants.length; i++)
	{
		query = query + "{\"participants\":\""+participants[i]+"\"},";
	}

	console.log("query before slice "+query);
	query = query.substring(0, query.length - 1);
	console.log("query after slice "+query);
	query = query + "]}";

	Room.findOne(JSON.parse(query),function(err,room){
		
		if (err){

			callback(err,null);
		}
		else if (room) {
			console.log("There is already a room for these users with name = " + room);
			callback(null, room.roomname);
		}
		else {
			
			console.log("We need to create a new room for these users :) ");	

			var instance = new Room();
			var randomRoomName = Math.random().toString(36).slice(2);
			instance.roomname =  randomRoomName;
			instance.participants = participants;

			instance.save(function (err) {
				if (err) {
					callback(err,null);
				} else {
					callback(null, randomRoomName);
				}
			});

		}


	})

}

