var voiceManager = require('./voiceManager')
var csscolors = require('css-color-names')
var lightManager = require('./lightManager')
var voiceManager = require('./voiceManager')
var audioManager = require('./audioManager')
var commandManager = require('./commandManager')
var djManager = require('./djManager')
const say = require('say');

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
	lightManager.addColorForAllLights(0, 0, sequence.data.quantity, 350, 0, null)
}

logicFunctions.addWarmth = function(sequence) {
	voiceManager.clearSpeechStack()
	lightManager.addColorForAllLights(0, 0, 0, 350, sequence.data.quantity, null)
}

logicFunctions.playAudioFile = function(sequence) {
	voiceManager.clearSpeechStack()
	audioManager.playAudioFile(sequence.data.fileName)
}

logicFunctions.setLightsPower = function(sequence) {
	lightManager.setLightsPowerStatus(sequence.data.lightNames, sequence.data.powerStatus)
}

logicFunctions.allTheLightsPower = function(sequence) {
	lightManager.setAllLightsPowerStatus(sequence.data.powerStatus)
}

logicFunctions.saveLightState = function(sequence) {
	lightManager.saveLightsState(sequence.data.saveName)
}

logicFunctions.loadLightState = function(sequence) {
	lightManager.loadLightsState(sequence.data.saveName)
}

logicFunctions.rotateColors = function(sequence) {
	lightManager.stopRotatingColors()
	lightManager.startRotatingColors(sequence.data.duration, sequence.data.delay)
	voiceManager.clearSpeechStack()
}

logicFunctions.stopRotating = function(sequence) {
	lightManager.stopRotatingColors()
	voiceManager.clearSpeechStack()
}

logicFunctions.enableVolumeBrightness = function(sequence) {
	lightManager.stopRotatingColors()
	voiceManager.clearSpeechStack()
	djManager.listen()
}

logicFunctions.disableVolumeBrightness = function(sequence) {
	voiceManager.clearSpeechStack()
	djManager.stopListening()
}

logicFunctions.rollDice = function(sequence) {
	voiceManager.clearSpeechStack()
	var selectedNumber = getRandomInt(1, sequence.data.maxNumber)
	if (sequence.data.maxNumber == 20) {
		if (selectedNumber == 1) {
			say.speak("You rolled a 1. Critical failure!")
			commandManager.playCommandFromName("crit failure")
			return
		} else if (selectedNumber == 20) {
			say.speak("You rolled a 20. Critical success!")
			commandManager.playCommandFromName("crit success")
			return
		}
	}
	say.speak("You rolled a " + selectedNumber + " out of " + sequence.data.maxNumber)
}

logicFunctions.turnOffThor = function(sequence) {
	voiceManager.clearSpeechStack()
	commandManager.turnOffThor()
}

logicFunctions.fallenHeroes = function(sequence) {
	voiceManager.clearSpeechStack()
	commandManager.turnOffThor()
	audioManager.playAudioFile("arms_of_angel.mp3")
	lightManager.setLivingroomColor(259, 100, 25, 6000, 2500)
	setTimeout(function() {
		//lightManager.setColorForLightByName("Tall Lamp", 259, 100, 65, 6000, 2500, null)
		var openingWords = "In loving memory of those who have fallen in battle. Please take a moment of silence for these brave heroes."

		shuffle(deadCharacters)
		say.speak(openingWords, 'Good News', 1.0, (err) => {
		  if (err) {
		    return console.error(err)
		  }
		  console.log("Opening words callback")
		  var index = 0
		  var sayFallenHero = function(index) {
		  	lightManager.setLivingroomColor(259, 95, 55, 2500, 250)
		  	setTimeout(function() { lightManager.setLivingroomColor(259, 100, 25, 2500, 250)}, 300)
		  	
	  		say.speak(deadCharacters[index], 'Good News', 1.0, (err) => {
	  			say.stop()
	  			 if (err) {
				    return console.error(err)
				 }
				index ++
				if (index < deadCharacters.length) {
					setTimeout(function(){ sayFallenHero(index) }, 150)
				} else {
			        say.speak("And those whose names who have been lost to time.")
			        lightManager.setLivingroomColor(0, 0, 80, 2500, 8000)
				}
	  		})
		  }
		  sayFallenHero(0)

		})
	}, 3000)
	
}

var deadCharacters = ["Andy's Monk", "Andy's fighter", "Andy's Bard", "Andy's paladin", "Andy's rogue", "Peace Bringer", 
				"Isabelle Hawklight", "Grug Dar", "Gerrol", "Apollo the hungry", "Kel thuraz the Reaper", "Serge", "Awrathia's ashes", 
				"Sir Particleees of house bloom", "Just in Case", "Axel fire born", "Fall hand the guard", "Half man the guard", 
				"Pad worth the guard", "Stubs the horse", "Long tooth the guard"]

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle( array ){
 var count = array.length,
     randomnumber,
     temp;
 while( count ){
  randomnumber = Math.random() * count-- | 0;
  temp = array[count];
  array[count] = array[randomnumber];
  array[randomnumber] = temp
 }
}

exports.manager = sequenceManager
exports.startSequence = startSequence

