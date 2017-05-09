const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
var config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  verbose: false,
  speechContexts: {
  	phrases: ["light"]
  }
}
const record = require('node-record-lpcm16');
const Speech = require('@google-cloud/speech');
const projectId = 'derekschindhelmsite';
const speech = Speech({
	projectId: projectId
});
const fs = require('fs');
const eos = require('end-of-stream');
const commandManager = require('./commandManager')
console.log(commandManager.test)
const maxBufferHistory = 10
const maxSpeechStackSize = 8
var speechStack = []

var voiceManager = function() {
	streamingMicRecognize = function(filebaseName, counter) {
		counter ++
		var fileName = getCurrentBufferFile(filebaseName, counter)
	    var file = fs.createWriteStream(fileName, { encoding: 'binary' })
	    var isRecording = true
	    eos(file, function(err) {
	    	isRecording = false
	    	streamingMicRecognize(filebaseName, counter)
			if (err) return console.log('stream had an error or closed early ' + err);
			speech.recognize(fileName, config)
				    .then((results) => {
				      const transcription = results[0];
				      addToSpeechStack(transcription)
				      if(transcription.length > 0) console.log("you: " + `${transcription}`);
				      console.log(getTotalSpeechStack())
				      commandManager.detectCommands(getTotalSpeechStack())
				    })
				    .catch((err) => {
				      console.error('ERROR:', err);
				    });
		});

		record.start({
			sampleRateHertz: sampleRateHertz,
			thresholdStart: 0.05,
			thresholdEnd: 0,
			recordProgram: 'sox',
			verbose: false,
			useSilence: false,
			asRaw: false
		}).pipe(file)

		setTimeout(function(){ if(isRecording) record.stop() }, 3000)
		if(counter >= maxBufferHistory) counter = 0
	}

	getCurrentBufferFile = function(baseName, counter) {
		return "./voice_recog_samples/" + baseName + counter + ".wav"
	}

	streamingMicRecognize("sampleOne", 0)
	setTimeout(function() {streamingMicRecognize("sampleTwo", 0)}, 1500)
}

var addToSpeechStack = function(data) {
		for(var i =  0; i < maxSpeechStackSize - 1; i++) {
			speechStack[i] = speechStack [i + 1]
		}
		speechStack[maxSpeechStackSize - 1] = data
	}

var getTotalSpeechStack = function() {
	var totalSpeech = ""
	for(var i = 0; i < maxSpeechStackSize; i++) {
		totalSpeech += speechStack[i] + " "
	}
	return totalSpeech.toLowerCase()
}

var clearSpeechStack = function() {
	speechStack = []
	for(var i = 0; i < maxSpeechStackSize; i++) {
		speechStack.push('')
	}
}
clearSpeechStack()

var addSpeechContextWords = function(arrayOfWords) {
	arrayOfWords.forEach(function(word) {
		config.speechContexts.phrases.push(word)
	})
}

addSpeechContextWords(['1','2','3', '4', '5', '10', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100'])

exports.manager = voiceManager();
exports.clearSpeechStack = clearSpeechStack
exports.addSpeechContextWords = addSpeechContextWords



 
