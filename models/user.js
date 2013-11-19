var db = require('../lib/db.js');

var UserSchema = new db.Schema({
	username: {
		type: String,
		unique: true
	},
	password: String,
	tokens: [String]

})

var MyUser = db.mongoose.model('User', UserSchema);

// Exports
module.exports.addUser 		= addUser;
module.exports.checkLogin 	= checkLogin;
module.exports.addUserToken	= addUserToken;
// Add user to database
function addUser(username, password, callback) {

	console.log("Inside add user function");
	var instance = new MyUser();
	instance.username = username;
	instance.password = password;

	instance.save(function (err) {
		if (err) {
			callback(err,null);
		} else {
			callback(null, instance["username"]);
		}
	});

}

function addUserToken(username1,token1, callback) {

	// check if a room already exists with these participants ..
	MyUser.findOne({tokens:token1},function (err, user) { 

		if (err){
			callback(err);
		}
		if (user){
			callback(null,user);
		}
		else{
			 
			MyUser.findOneAndUpdate({username: username1},{$push: { "tokens": token1}}, function(err,user){
				if (err){
					callback(err, null);
				}
				else{
					callback(null,user);
				}
					
			})

		}

	});
	
}



function checkLogin(username1, password1, callback){
	

	MyUser.findOne({username:username1,password:password1},function(err,user){
		
		console.log("checkLogin " + user);
		if (err) {
			callback(err);
		} else {
			
			if (user) {
				callback(null, user.username);
			}
			else {
				callback(null,null)	
			}
				
		}
		
	});

}