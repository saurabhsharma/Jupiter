var db = require('../lib/db.js');

var UserSchema = new db.Schema({
	username: {
		type: String,
		unique: true
	},
	password: String
})

var MyUser = db.mongoose.model('User', UserSchema);

// Exports
module.exports.addUser = addUser;
module.exports.checkLogin = checkLogin;
// Add user to database
function addUser(username, password, callback) {
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

function checkLogin(username1, password1, callback){
	

	MyUser.find({username:username1,password:password1},function(err,user){

		if (err) {
			callback(err);
		} else {
			
			if (user.length) {
				callback(null, user[0].username);
			}
			else {
				callback(null,0)	
			}
				
		}
		
	});

}