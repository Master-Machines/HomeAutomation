
var coreAudio = require("node-core-audio");
var engine = coreAudio.createNewAudioEngine();
engine.setOptions({ inputChannels: 1, outputChannels: 1, interleaved: false, inputDevice: 0 });
var fftInPlace = require('fft-js').fftInPlace,
    fftUtil = require('fft-js').util

function processAudio( inputBuffer ) {
  	var freqs = []
 	for(var i = 0; i < inputBuffer[0].length; i++) {
 		freqs.push(inputBuffer[0][i])
 		inputBuffer[0][i] = 0
 	}
 	fftInPlace(freqs)
    var magnitudes = fftUtil.fftMag(freqs); 
    var magnitude = 0
    for(var i = 0; i < magnitudes.length; i++) {
 		magnitude += magnitudes[i]
 	}
 	checkForBeat(magnitude)
    return inputBuffer;
}

var previousSampleCount = 25
var previousSamples = Array(previousSampleCount)

function checkForBeat(magnitude) {
	var average = averageValueFromArray(previousSamples)
	if(magnitude > 2.7 * average) {
		console.log("beat!")
		adjustPreviousSampleCount(magnitude * 150)
	} else {
		adjustPreviousSampleCount(magnitude)
	}
}

function adjustPreviousSampleCount(newSample) {
	for(var i = 0; i < previousSampleCount - 1; i++) {
		previousSamples[i + 1] = previousSamples[i]
	}
	previousSamples[0] = newSample
}

function averageValueFromArray(arr) {
	var counter = 0
	for(var i = 0; i < arr.length; i++) {
		counter += arr[i]
	}
	return counter / arr.length
}

engine.addAudioCallback( processAudio );


var djManager = (function() {

})


exports.manager = djManager