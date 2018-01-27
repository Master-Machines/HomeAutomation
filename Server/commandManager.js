/*
	CommandManager aka Command Module.
	Handles mapping words to command files.
*/

var dir = require('node-dir');

var commandList = []
var sequence = require("./sequence").sequence
var sequenceManager = require("./sequenceManager")
var voiceManager = require("./voiceManager")

var thorEnabled = false
let thorTimoutLength = 20000
var thorTimeout = null

var commandManager = (function() {
	var command = require('./command').command;
	var allTriggerWords = []
	dir.readFiles("./commands",{
	    	match: /.json$/
		},	
	    function(err, content, next) {
	        if (err) throw err;
	        var newCommand = new command(JSON.parse(content))
	        newCommand.triggerWords.forEach(function(word) {
	        	allTriggerWords.push(word)
	        })
	        commandList.push(newCommand)
	        if(newCommand.commandName == "the grid") {
	        //	performCommand(newCommand, [""])
	        }
	        next()
	    },
	    function(err, files){
	        if (err) throw err;
	        voiceManager.addSpeechContextWords(allTriggerWords)
	        commandList.sort(function(a, b) {
	        	return b.priority - a.priority
	        })
	        console.log('finished reading files:', files);
	    });
	// TODO: Sort the command list by priority


})()

var checkForThor = function(words) {
	let index = words.toLowerCase().indexOf("thor")
	if (index > -1) {
		thorEnabled = true
		if (thorTimeout != null) {
			clearTimeout(thorTimeout)
			thorTimeout = null
		}
		thorTimeout = setTimeout(function() {
			thorEnabled = false
		}, thorTimoutLength)
		voiceManager.clearSpeechStack()
	}
}

var detectCommands = function(words) {
	checkForThor(words)
	if (thorEnabled) {
		for(var i = 0; i < commandList.length; i++) {
			var command = commandList[i]
			var isValidCommand = true
			for(var wordIndex = 0; wordIndex < command.triggerWords.length; wordIndex++) {
				if(words.indexOf(command.triggerWords[wordIndex]) == -1) {
					isValidCommand = false
				}
			}

			if(isValidCommand) {
				performCommand(command, words)
				return
			}
		}
	}
}

var performCommand = function(command, wordsSaid) {
	console.log("valid command found!")
	for(var i = 0; i < command.sequences.length; i++) {
		command.sequences[i].wordsSaid = wordsSaid
		sequenceManager.startSequence(command.sequences[i])
	}
}

var playCommandFromName = function(name) {
	commandList.forEach(function(command) {
		if (command.commandName == name) {
			performCommand(command, [])
		}
	})
}

var getCommandList = function() {
	var commandNames = []
	commandList.forEach(function(command) {
		commandNames.push(command.commandName)
	})
	return commandNames
}

var turnOffThor = function() {
	if (thorTimeout != null) {
		clearTimeout(thorTimeout)
		thorTimeout = null
	}
	thorEnabled = false
}


exports.manager = commandManager
exports.detectCommands = detectCommands
exports.commandList = getCommandList
exports.playCommandFromName = playCommandFromName
exports.turnOffThor = turnOffThor