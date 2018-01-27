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


var lightManager = require('./lightManager')
var commandManager = require('./commandManager')
var voiceManager = require('./voiceManager')
var djManager = require('./djManager')


const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname  + '/public/commandList.html')
})

app.get('/gamepad', function (req, res) {
	res.sendFile(__dirname + '/public/gamepad-controls.html')
})

app.get('/dnd', function (req, res) {
	res.sendFile(__dirname + '/public/dnd.html')
})

app.get('/commands', function (req, res) {
	console.log(commandManager.commandList())
	res.json(commandManager.commandList())
})

app.get('/commands/play', function(req, res) {
	var commandToPlay = req.query.command
	console.log("Playing from webapp command: " + commandToPlay)
	commandManager.playCommandFromName(commandToPlay)
	res.end()
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})