var voiceManager = require('./voiceManager')
var csscolors = require('css-color-names')
var lightManager = require('./lightManager')
var voiceManager = require('./voiceManager')
var audioManager = require('./audioManager')

var sequenceManager = (function() {
	var colors = []
	for ( key_name in csscolors) {
		colors.push(key_name)
	}
	voiceManager.addSpeechContextWords(colors)
})()

var startSequence = function(sequence) {
	if(sequence.startTime == null) {
		triggerSequence(sequence)
	} else {
		setTimeout(function(){ triggerSequence(sequence)}, sequence.startTime)
	}
}

var triggerSequence = function(sequence) {
	if (sequence.type == "lighting") {
		voiceManager.clearSpeechStack()
		var lightManager = require('./lightManager');
		var duration = sequence.data.duration
		var name = sequence.data.lightName
		if(name) {
			lightManager.setColorForLightByName(name, sequence.data.color.hue, sequence.data.color.saturation, sequence.data.color.brightness, duration, sequence.data.color.kelvin, null)
		} else {
			lightManager.setColorForAllLights(sequence.data.color.hue, sequence.data.color.saturation, sequence.data.color.brightness, duration, sequence.data.color.kelvin, null)
		}
	} else if (sequence.type == "logic") {

		var funcName = sequence.data.functionName
		logicFunctions[funcName](sequence)
	} 
}

var logicFunctions = {}

logicFunctions.setColor = function(sequence) {
	console.log(JSON.stringify(sequence))
	var words = sequence.wordsSaid.split(' ');
	words.forEach(function(word) {
		var hexCode = csscolors[word]
		if(hexCode != null) {
			voiceManager.clearSpeechStack()
			var duration = sequence.data.duration
			lightManager.setHexColorForAllLights(hexCode, duration, null)
			return
		}
	})
}

logicFunctions.setBrightness = function(sequence) {
	var words = sequence.wordsSaid.split(' ');
	words.forEach(function(word) {
		var intVal = parseInt(word)
		if(isNaN(intVal) == false) {
			voiceManager.clearSpeechStack()
			lightManager.setBrightnessForAllLights(intVal)
			return
		}
	})
}

logicFunctions.addBrightness = function(sequence) {
	voiceManager.clearSpeechStack()
	lightManager.addColorForAllLights(0, 0, sequence.data.quantity, 500, 0, 0)
}

logicFunctions.addWarmth = function(sequence) {
	voiceManager.clearSpeechStack()
	lightManager.addColorForAllLights(0, 0, 0, 500, sequence.data.quantity, 0)
}

logicFunctions.playAudioFile = function(sequence) {
	voiceManager.clearSpeechStack()
	audioManager.playAudioFile(sequence.data.fileName)
}



exports.manager = sequenceManager
exports.startSequence = startSequence