
var coreAudio = require("node-core-audio");
var engine = coreAudio.createNewAudioEngine();
engine.setOptions({ inputChannels: 1, outputChannels: 1, interleaved: false, inputDevice: 0 });
var fftInPlace = require('fft-js').fftInPlace,
    fftUtil = require('fft-js').util
var lightManager = require('./lightManager')
var lightConfigs = []

var lightConfig = (function(light, volumeMap, color, baseBrightness, maxBrightness) {
	this.lightName = light
	this.isVolumeMap = volumeMap
	this.rampUpTime = 150
	this.rampDownTime = 150
	this.baseBrightness = baseBrightness
	this.maxBrightness = maxBrightness
	this.color = color

	this.trigger = function() {
		lightManager.setColorForLightByName(this.lightName, this.color, 100, this.maxBrightness, this.rampUpTime)
		var config = this
		setTimeout(function() {
			lightManager.setColorForLightByName(config.lightName, this.color, 100, this.baseBrightness, config.rampDownTime)
		}, this.rampUpTime)
	}



	if (volumeMap) {
		this.currentBrightness = 10
		this.lastBroadcastedBrightness = 0
		// Used for volume map.
		this.update = function(brightness) {
			brightness += this.baseBrightness
			if(brightness > this.maxBrightness) brightness = this.maxBrightness
			if(brightness < 0) brightness = 0
			this.currentBrightness = brightness
		}


		this.broadcastBrightness = function() {
			if(Math.abs(this.currentBrightness - this.lastBroadcastedBrightness) > 1) {
				lightManager.setColorForLightByName(this.lightName, this.color, 100, this.currentBrightness, 70)
				this.lastBroadcastedBrightness = this.currentBrightness
			}
			var that = this
			setTimeout(function() {
				that.broadcastBrightness()
			}, 350)
		}
		this.broadcastBrightness()
	}


})

// Colors: blue: 242 teal: 176 pinkish: 304

lightConfigs.push(new lightConfig("Tall Lamp", true, 48, 35, 70))
lightConfigs.push(new lightConfig("Table Lamp", true, 48, 35, 70))
lightConfigs.push(new lightConfig("Shade Cylinder", true, 48, 35, 70))
lightConfigs.push(new lightConfig("Entrance", true, 48, 35, 70))



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
 	//checkForBeat(magnitude)
    return inputBuffer;
}

var previousSampleCount = 15
var previousSamples = Array(previousSampleCount)

function checkForBeat(magnitude) {
	var average = averageValueFromArray(previousSamples)
	var brightness = magnitude / 20
	console.log(brightness)
	lightConfigs.forEach(function(config) {
		if(config.isVolumeMap) {
			config.update(brightness)
		}
	})
	if(magnitude > 2.5 * average) {
		lightConfigs.forEach(function(config) {
			if(!config.isVolumeMap) {
				config.trigger()
			}
		})
		adjustPreviousSampleCount(magnitude * 1)
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