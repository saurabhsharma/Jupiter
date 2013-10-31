var net = require("net"),
	User = require('./models/user.js'),
	Room = require('./models/room.js');


var onlineUsers = Object();
var rooms = Object();
 

// our TCP server :)

var server = net.createServer(function (stream) {
	
	console.log("Stream = "+stream);


	//stream.setKeepAlive(true);
	stream.setTimeout(000);
	stream.setEncoding("utf8");
	
	stream.addListener("data", function (data) {
		
		console.log("incoming data - \n"+data);
		
		
		var incomingStanza = JSON.parse(data);
		 		
		// Check for sign_up cmd
		if (incomingStanza.cmd == "signUp") {
		
			var username = incomingStanza.data.userName;
			var password = incomingStanza.data.password;
			
			User.addUser(username, password, function(err, userName) {
				if (err){
					throw err;
				}
				//stream.write("user created with userName = " + userName);
				stream.write("{\"replyCode\": \"200\",\"data\": {\"userName\": \""+userName+"\"}}");

			});
			
		}
		
		// Check for login cmd

		if (incomingStanza.cmd == "login") {
		
			var username = incomingStanza.data.userName;
			var password = incomingStanza.data.password;
			
			User.checkLogin(username, password, function(err, userName) {
				if (err){
					throw err;
				}
				console.log("user logged in with userName = " + userName);
				// todo: check if user already in onlineUsers list
				onlineUsers[userName] = stream;
				stream.write("{\"replyCode\": \"200\",\"data\": {\"userName\": \""+userName+"\"}}");
				//console.log(onlineUsers);
 

				
			});
			
		}


		if (incomingStanza.cmd == "startRoom") {

			var participants = incomingStanza.data.participants;

			 
			Room.getRoom(participants, function(err,roomName){

				if (err){
					throw err;
				}

				console.log("Room Name = " + roomName);
				stream.write("{\"replyCode\": \"200\",\"data\": {\"roomName\": \""+roomName+"\"}}");
			});


		}


		
	 
		
	});
	
	
	stream.addListener("end", function () {
	
		console.log("End listener");
		stream.end();
		//stream.destroy();
		
	});
	
	
	
	
});

server.listen(6969);

server.addListener("connection", function () {
	console.log("Welcome to Jupiter!!!");
});

console.log("Chat server listening on post number 6969\n");