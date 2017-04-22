
var voiceManager = function() {
	streamingMicRecognize()
}


streamingMicRecognize = function() {
  // [START speech_streaming_mic_recognize]
  const record = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  // Your Google Cloud Platform project ID
	const projectId = 'derekschindhelmsite';

  // Instantiates a client
  const speech = Speech({
	projectId: projectId
  });

  // The encoding of the audio file, e.g. 'LINEAR16'
  const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  const languageCode = 'en-US';
const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode
    }
  const request = {
    config: config,
    singleUtterance: false,
    interimRconfig: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode
    },esults: false
  };

  // Create a recognize stream
  // const recognizeStream = speech.createRecognizeStream(request)
  //   .on('error', console.error)
  //   .on('data', (data) => console.log(data.results))
  //   .on('write', (writing) => console.log(writing))
  //   .on('response', (response) => console.log(response));

	var fs = require('fs');
    var file = fs.createWriteStream('test.wav', { encoding: 'binary' })
    var eos = require('end-of-stream');
    var isRecording = true

    eos(file, function(err) {
    	isRecording = false
		if (err) return console.log('stream had an error or closed early');
		// fs.createReadStream('./test.wav')
	 //    .on('error', console.error)
	 //    .pipe(speech.createRecognizeStream(request))
	 //    .on('error', console.error)
	 //    .on('data', function(data) {
	 //      console.log(data.results)
	 //    });
	 streamingMicRecognize()
	    speech.recognize("./test.wav", config)
	    .then((results) => {
	      const transcription = results[0];

	      console.log(':' + `${transcription}`);
	      
	    })
	    .catch((err) => {
	      console.error('ERROR:', err);
	    });
	});
  // Start recording and send the microphone input to the Speech API
  record.start({
    sampleRateHertz: sampleRateHertz,
    thresholdStart: 0.05,
    thresholdEnd: 0,
    recordProgram: 'sox',
    verbose: false,
    useSilence: false,
    asRaw: false
  }).pipe(file)
 
  setTimeout(function(){ if(isRecording) record.stop() }, 2000)

  // console.log('Listening, press Ctrl+C to stop.');
  // [END speech_streaming_mic_recognize]
}

module.exports = voiceManager;




 
