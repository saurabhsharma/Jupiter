var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
// Connect to cloud database
//var username = "saurabh"
//var password = "konstant";
//var address = '@ds043358.mongolab.com:43358/jupiter';
var username = ""
var password = "";
var address = '@localhost/jupiter';
connect();

// Connect to mongo
function connect() {
  var url = 'mongodb://' + username + ':' + password + address;
  mongoose.connect(url);
}

function disconnect() {
    mongoose.disconnect()
}
