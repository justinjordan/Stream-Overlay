const portAudio = require('naudiodon');
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
			sampleRate: 1000,
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
		audio_data = [];
		for (var x in buffer)
		{
			audio_data.push(buffer[x]);
		}

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
