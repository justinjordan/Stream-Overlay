const portAudio = require('naudiodon');
const AudioContext = require('web-audio-api').AudioContext;
const san = require('stereo-analyser-node');
const fs = require('fs');

module.exports = new (function() {

	var _this = this;

	var audio_data;
	this.getDevices = portAudio.getDevices;

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

			default: // use mic (or default device)
		}

		// Setup AudioReader
		var pr = new portAudio.AudioReader({
			channelCount: 2,
			sampleFormat: portAudio.SampleFormat8Bit,
			sampleRate: 44100,
			deviceId: deviceId
		});

		// Start read
		pr.once('audio_ready', function(pa) {
			pr.pa.start();
		});

		// Send audio buffer back to callback :)
		pr.on('data', function(buffer) {
			_this.analyze_audio(buffer).then(callback, console.error);
		});
	};

	this.analyze_audio = function(buffer, callback)
	{
		var ctx = new AudioContext();
		var audioBuffer = ctx.createBuffer(2, 256, 44100);

		var index;
		var left = audioBuffer.getChannelData(0);
		var right = audioBuffer.getChannelData(1);
		for (var i = 0; i < buffer.length; i++)
		{
			index = Math.floor(i/2);
			if (i%2==0)
			{
				left[index] = buffer[i];
			}
			else
			{
				right[index] = buffer[i];
			}
		}
		audio_data = {
			left: left,
			right: right
		};

		// use promise
		if (typeof callback !== 'function')
		{
			return new Promise(function(resolve, reject) {
				if (!audio_data)
					{ reject('No audio_data to send!'); }

				resolve(audio_data);
			});
		}

		// use callback
		callback(audio_data);
	};

});
