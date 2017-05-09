// var player = require('play-sound')(opts = {})
var Player = require('player');

var audioManager = (function() {

})

var playAudioFile = function(songFile) {
	var filePath = "./audio_files/" + songFile
	console.log("Playing audio file " + filePath)
	var player = new Player(filePath)
	player.play(function(err, player){
	  console.log('playend!');
	});
	// player.play(filePath, function(err){
	// 	if (err) console.log(err)
	// })
}

exports.manager = audioManager
exports.playAudioFile = playAudioFile