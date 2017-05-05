// (function() {
//     var childProcess = require("child_process");
//     var oldSpawn = childProcess.spawn;
//     function mySpawn() {
//         console.log('spawn called');
//         console.log(arguments);
//         var result = oldSpawn.apply(this, arguments);
//         return result;
//     }
//     childProcess.spawn = mySpawn;
// })();

var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var lightManager = require('./lightManager');
// lightManager.setColorForAllLights(0,0,0, null, null)
var commandManager = require('./commandManager');
// var lightManagerInstance = lightManager()

var voiceManager = require('./voiceManager');

app.use(express.static(__dirname + '/public'))
io.on('connection', function(){ 
	console.log("NEW CONNECTION")
});
server.listen(5000);