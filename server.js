var net = require("net");

var server = net.createServer(function (stream) {
	
	stream.setTimeout(0);
	stream.setEncoding("utf8");
	
	stream.addListener("data", function (data) {
	
		console.log("Data listener");
		stream.write("in data listener");
		
		console.log(data);
		// var incomingCommand = JSON.parse(data);
		// console.log(incomingCommand.register);		
		
		
	});
	
	
	stream.addListener("end", function () {
	
		console.log("End listener");
		stream.end();
		
	});
	
	
	
	
});

server.listen(6969);

server.addListener("connection", function () {
	console.log("Welcome to Jupiter!!!");
});

console.log("Chat server listening on post number 6969\n");