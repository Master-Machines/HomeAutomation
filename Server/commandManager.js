/*
	CommandManager aka Command Module.
	Handles mapping words to command files.
*/

var dir = require('node-dir');

var commandList = []
var sequence = require("./sequence").sequence
var sequenceManager = require("./sequenceManager")
var voiceManager = require("./voiceManager")
var test = "tset"

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

var detectCommands = function(words) {
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

var performCommand = function(command, wordsSaid) {
	console.log("valid command found!")
	for(var i = 0; i < command.sequences.length; i++) {
		command.sequences[i].wordsSaid = wordsSaid
		sequenceManager.startSequence(command.sequences[i])
	}
}


exports.manager = commandManager;
exports.detectCommands = detectCommands