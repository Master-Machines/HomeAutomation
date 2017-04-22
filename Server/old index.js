var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var FFT = require('fft');
var lightManager = require('./lightManager');
var lightManagerInstance = lightManager()
app.use(express.static(__dirname + '/public'))
io.on('connection', function(){ 
	console.log("NEW CONNECTION")
});
server.listen(5000);

// Create a new instance of node-core-audio
var coreAudio = require("node-core-audio");

// Create a new audio engine
var engine = coreAudio.createNewAudioEngine();
engine.setOptions({ inputChannels: 1, outputChannels: 2, interleaved: true, inputDevice: 0 });
//engine.setOptions({
//	inputDevice :2,});
var totalFrequencies = 256;
var fft = new FFT.complex(1024, 1)
var sample = 0;
var ampBuffer = new Float32Array(4000);
var highFilterAmount = 100 / 44100;
var counter2 = 0;
var revert = 1;
// Add an audio processing callback
// This function accepts an input buffer coming from the sound card,
// and returns an ourput buffer to be sent to your speakers.
//
// Note: This function must return an output buffer
function processAudio( buffer ) {
    // console.log( inputBuffer.length + " channels" );
    
    // var counter = 0;
    // inputBuffer[0].forEach(function(sample) {
    // 	if(sample > .01) counter += sample;
    // })
    // if (counter > 10) {
    // 	 console.log(counter);
    // }
 	//console.dir(inputBuffer)
   	//sengine.write(inputBuffer[0]);
    //return inputBuffer;
     var output = [];
     var counter = 0;
     superCounter ++;
    //console.dir(buffer);
    for (var i = 0; i < buffer.length; i++, sample++) {
        //Pan two sound-waves back and forth, opposing
        //var val1 = Math.sin(sample * 110.0 * 2 * Math.PI / 44100.0) * 0.25, val2 = Math.sin(sample * 440.0 * 2 * Math.PI / 44100.0) * 0.25;
       // var pan1 = Math.sin(1 * Math.PI * sample / 44100.0), pan2 = 1 - pan1;
		if(Math.abs(buffer[i]) < .01) {
			//buffer[i] = 0;
			// if(buffer[i] < 0) buffer[i] = -1 * highFilterAmount;
			// else buffer[i] = highFilterAmoun>;
		}
		counter += Math.pow(Math.abs(buffer[i]), 2);
        output.push(revert * buffer[i]); //left channel
        output.push(buffer[i]); //right channel
        //Save microphone input into rolling buffer
        //ampBuffer[sample%ampBuffer.length] = buffer[i];
    }
  	
    if(++counter2 == 4) {
    	counter2 = 0;
    // 	var frequencies = new Array(1024)
  		// fft.process(frequencies, 0, 1, buffer, 0, 1, 'real')
    	
    // 	var cutoffFrequencies = frequencies.slice(0, totalFrequencies);
    	io.sockets.emit("update", {buffer : buffer});
    }
    
    //SendBeatPower(counter);
    //addItUp(output)
    return output;
}
var superCounter = 0;
setInterval(function() {
	superCounter = 0;
	// revert *= -1;
}, 5000)

function addItUp(buffer) {
	var counter = 0;
	buffer.forEach(function(f) {
		counter += f;
	})
	console.log(counter);
}

function SendBeatPower(power) {
    if(power > 1) {
    	io.sockets.emit("beat", {power : power});
    }
}

//engine.addAudioCallback( processAudio );
