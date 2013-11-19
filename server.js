
var net 		= require("net"),
	User 		= require('./models/user.js'),
	Room 		= require('./models/room.js'),
	crypto 		= require('crypto');

var onlineUserTokens = Object();

var rooms = Object();
 

// our TCP server :)

var server = net.createServer(function (stream) {
	

	var stream_obj = '';
	for (property in stream) {
  		stream_obj += property + ': ' + stream[property]+'; ';
	}

	//stream.setKeepAlive(true);
	stream.setTimeout(000);
	stream.setEncoding("utf8");
	
	stream.addListener("data", function (data) {
		
		
		var incomingStanza = JSON.parse(data);
		 		
		// Check for sign_up cmd
		if (incomingStanza.cmd == "signUp") {
		
			var username = incomingStanza.data.userName;
			//var password = incomingStanza.data.password;
			//todo: we need to get password hash from client .. . we'll not create hash here
			var password = crypto.createHash('md5').update(incomingStanza.data.password).digest("hex");
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
			//var password = incomingStanza.data.password;
			//todo: we need to get password hash from client.. we'll not create hash here
			var password = crypto.createHash('md5').update(incomingStanza.data.password).digest("hex");
			
			User.checkLogin(username, password, function(err, userName) {
				if (err){
					throw err;
				}
				console.log("user logged in with userName = " + userName);
				// todo: we need to add one more thing in token - "device identifier" from where user have logged in
				// we need to get this "device identifier" with user's login stanza
				var token = ""+crypto.createHash('md5').update(incomingStanza.data.password).digest("hex")+crypto.createHash('md5').update(userName).digest("hex");

				User.addUserToken(username,token,function(err,user){

					if (err){
						stream.write("{\"replyCode\": \"300\",\"data\": {\"error\": \""+err+"\"}}");
					}
					else{

						// todo: check if user already in onlineUsers list
						onlineUserTokens[token] = stream;
						stream.write("{\"replyCode\": \"200\",\"data\": {\"token\": \""+token+"\"}}");

					}
 					

				});	

				
			});
			
			
		}


		if (incomingStanza.cmd == "startRoom") {

			var token = incomingStanza.token;


			validateSession(token, stream,function (){

					var participants = incomingStanza.data.participants;
					Room.getRoom(participants, function(err,roomName){

					if (err){
						throw err;
					}

					console.log("Room Name = " + roomName);
					stream.write("{\"replyCode\": \"200\",\"data\": {\"roomName\": \""+roomName+"\"}}");
				
				});

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


function validateSession(token,stream,callback){

	if (!onlineUserTokens[token])
		stream.write("{\"replyCode\": \"400\",\"data\": {\"err\": \"Session expired\",\"msg\": \"Login again\"}}");
	else
		callback();


}