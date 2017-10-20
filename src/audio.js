const portAudio = require('naudiodon');
const Render = require('audio-render');
// const pcm = require('pcm-util');
// const waa = require('web-audio-api');
const fs = require('fs');

module.exports = new (function() {

	var _this = this;

	var audio_data;
	// var audioCtx = new waa.AudioContext;
	// var audioSource = audioCtx.createBufferSource();

	this.getDevices = portAudio.getDevices;
	// console.log(this.getDevices());

	this.monitor = function(device, callback)
	{
		if (typeof callback !== 'function')
		{
			console.error('audio.monitor: callback not a function');
			return;
		}

		var deviceId = null;
		switch (typeof device)
		{
			case 'number': // by id
				deviceId = device;
			break;

			case 'string': // by name
				var devices = portAudio.getDevices();
				for (var x in devices)
				{
					var d = devices[x];

					if (d.name===device)
					{
						deviceId = d.id;
						break;
					}
				}
			break;

			default: // use default input device (usually mic)
		}

		// Setup AudioReader
		var pr = new portAudio.AudioReader({
			channelCount: 2,
			sampleFormat: portAudio.SampleFormat16Bit,
			sampleRate: 44100,
			deviceId: deviceId
		});

		// Start read
		pr.once('audio_ready', function(pa) {
			pr.pipe(Render(function (canvas) {
			    var data = this.getFrequencyData();

				callback(data);

			    //draw volume, spectrum, spectrogram, waveform — any data you need
			}));
			pr.pa.start();
		});

		// Send audio buffer back to callback :)
		// pr.on('data', function(buffer) {
		// 	_this.convert_audio(buffer).then(callback, console.error);
		// });
	};

	// this.convert_audio = function(buffer, callback)
	// {
	// 	var audioBuffer = pcm.toAudioBuffer(buffer, {
	// 		channels: 2,
	// 	    sampleRate: 44100,
	// 	    interleaved: true,
	// 	    float: false,
	// 	    signed: true,
	// 	    bitDepth: 16,
	// 	    // byteOrder: 'LE',
	// 	    // max: 32767,
	// 	    // min: -32768,
	// 	    samplesPerFrame: 1024,
	// 	    // id: 'S_16_LE_2_44100_I'
	// 	});
	//
	// 	audio_data = audioBuffer;
	//
	// 	// use promise
	// 	if (typeof callback !== 'function')
	// 	{
	// 		return new Promise(function(resolve, reject) {
	// 			if (!audio_data)
	// 				{ reject('No audio_data to send!'); }
	//
	// 			resolve(audio_data);
	// 		});
	// 	}
	//
	// 	// use callback
	// 	callback(audio_data);
	// };

});
