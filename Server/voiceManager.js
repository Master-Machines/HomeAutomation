
var voiceManager = function() {
	
	const encoding = 'LINEAR16';
	const sampleRateHertz = 16000;
	const languageCode = 'en-US';
	const config = {
	  encoding: encoding,
	  sampleRateHertz: sampleRateHertz,
	  languageCode: languageCode
	}
	const record = require('node-record-lpcm16');
	const Speech = require('@google-cloud/speech');
	const projectId = 'derekschindhelmsite';
	const speech = Speech({
		projectId: projectId
	});
	const fs = require('fs');
	const eos = require('end-of-stream');

	const maxBufferHistory = 10
	var counter = 0
	const maxSpeechStackSize = 3
	var speechStack = []

	

	streamingMicRecognize = function() {
		var fileName = getCurrentBufferFile()
	    var file = fs.createWriteStream(fileName, { encoding: 'binary' })
	    var isRecording = true
	    eos(file, function(err) {
	    	isRecording = false
	    	streamingMicRecognize()
			if (err) return console.log('stream had an error or closed early');
		    speech.recognize(fileName, config)
		    .then((results) => {
		      const transcription = results[0];
		      addToSpeechStack(transcription)
		      console.log(':' + `${transcription}`);
		      console.log(getTotalSpeechStack())
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
	 
		setTimeout(function(){ if(isRecording) record.stop() }, 1500)
		if(++counter == maxBufferHistory) counter = 0
	}

	getCurrentBufferFile = function() {
		return "./voice_recog_samples/sample" + counter + ".wav"
	}

	clearSpeechStack = function() {
		speechStack = []
		for(var i = 0; i < maxSpeechStackSize; i++) {
			speechStack.push('')
		}
	}
	clearSpeechStack()

	addToSpeechStack = function(data) {
		for(var i = maxSpeechStackSize - 1; i > 0; i--) {
			speechStack[i - 1] = speechStack [i]
		}
		speechStack[maxSpeechStackSize - 1] = data
	}

	getTotalSpeechStack = function() {
		var totalSpeech = ""
		for(var i = 0; i < maxSpeechStackSize; i++) {
			totalSpeech += speechStack[i] + " "
		}
		return totalSpeech
	}

	streamingMicRecognize()
}

module.exports = voiceManager;




 
